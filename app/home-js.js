		let quizData = window.quizData || {};
		const modeCaptions = { qcm: "Choisis parmi plusieurs propositions.", texte: "Écris ta réponse avec tes propres mots.", aleatoire: "Le format change au fil des questions." };
		const themeIcons = { ethique: "balance.svg", gnu_linux: "terminal.svg" };
		let supabaseClient = null;
		let currentUser = null;
		let loadedUserId = null;
		let passwordSetupInProgress = false;
		let mfaFactorId = null;
		let mfaChallengeId = null;
		let adminMfaPending = false;
		let progressData = createEmptyProgress();
		let activeTheme = "ethique";
		let activeSeriesId = null;
		let activeMode = "qcm";
		let quizSession = null;

		function parseQuizPayload(rawText) {
			if (!rawText || !rawText.trim()) return null;
			const trimmed = rawText.trim();
			if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
				try {
					const parsed = JSON.parse(trimmed);
					if (parsed && typeof parsed === "object" && Array.isArray(parsed.series)) return parsed;
					if (parsed && typeof parsed === "object" && Object.values(parsed).some((theme) => theme && typeof theme === "object" && Array.isArray(theme.series))) return parsed;
				} catch (error) {
					// Continue below for JS payloads.
				}
			}
			try {
				const script = new Function("window", `${trimmed}; return window.quizData ?? null;`);
				const sandboxWindow = {};
				const parsed = script(sandboxWindow);
				if (parsed && typeof parsed === "object") {
					if (Array.isArray(parsed.series)) return parsed;
					if (Object.values(parsed).some((theme) => theme && typeof theme === "object" && Array.isArray(theme.series))) return parsed;
				}
			} catch (error) {
				console.warn("Le fichier de quiz Supabase ne correspond pas à un payload exploitable.", error);
			}
			return null;
		}

		async function loadQuizDataFromSupabase() {
			const config = window.SUPABASE_CONFIG || {};
			const directSources = config.quizDataSources || {};
			const remoteQuizData = {};
			for (const [themeId, source] of Object.entries(directSources)) {
				const candidates = Array.isArray(source) ? source : [source];
				for (const candidate of candidates) {
					if (!candidate) continue;
					try {
						const response = await fetch(candidate, { headers: config.anonKey ? { apikey: config.anonKey } : {} });
						if (!response.ok) continue;
						const text = await response.text();
						const data = parseQuizPayload(text);
						if (data && typeof data === "object") {
							const extractedTheme = data[themeId] || data;
							if (extractedTheme && typeof extractedTheme === "object" && Array.isArray(extractedTheme.series)) {
								remoteQuizData[themeId] = extractedTheme;
							} else if (Array.isArray(data.series)) {
								remoteQuizData[themeId] = data;
							}
							break;
						}
					} catch (error) {
						console.warn(`Le fichier de quiz ${candidate} n’a pas pu être chargé depuis Supabase.`, error);
					}
				}
			}
			if (Object.keys(remoteQuizData).length) return remoteQuizData;
			if (!config.url || !config.anonKey) return null;
			const bucket = config.quizBucket || config.storageBucket || "quiz-data";
			const storagePaths = config.quizStoragePaths || {
				ethique: ["ethique.json", "questions/ethique.json", "quizzes/ethique.json"],
				gnu_linux: ["gnu_linux.json", "questions/gnu_linux.json", "quizzes/gnu_linux.json"]
			};
			for (const [themeId, candidates] of Object.entries(storagePaths)) {
				const normalizedCandidates = Array.isArray(candidates) ? candidates : [candidates];
				for (const candidate of normalizedCandidates) {
					const path = candidate.replace(/^\/+/, "");
					const publicUrl = `${config.url.replace(/\/+$/, "")}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path.split("/").map((segment) => encodeURIComponent(segment)).join("/")}`;
					try {
						const response = await fetch(publicUrl, { headers: { apikey: config.anonKey } });
						if (!response.ok) continue;
						const text = await response.text();
						const data = parseQuizPayload(text);
						if (data && typeof data === "object") {
							const extractedTheme = data[themeId] || data;
							if (extractedTheme && typeof extractedTheme === "object" && Array.isArray(extractedTheme.series)) {
								remoteQuizData[themeId] = extractedTheme;
							} else if (Array.isArray(data.series)) {
								remoteQuizData[themeId] = data;
							}
							break;
						}
					} catch (error) {
						console.warn(`Le fichier de quiz ${candidate} n’a pas pu être chargé depuis le bucket Supabase.`, error);
					}
				}
			}
			return Object.keys(remoteQuizData).length ? remoteQuizData : null;
		}

		async function initializeQuizData() {
			const remoteQuizData = await loadQuizDataFromSupabase();
			if (remoteQuizData && Object.keys(remoteQuizData).length) {
				quizData = remoteQuizData;
			} else if (!Object.keys(quizData).length) {
				throw new Error("Les fichiers de questions par thème n'ont pas été chargés.");
			}
			const firstTheme = Object.keys(quizData)[0];
			if (firstTheme) {
				activeTheme = firstTheme;
				activeSeriesId = quizData[firstTheme]?.series?.[0]?.id || null;
			}
		}

		function createEmptyProgress() {
			return { quizzes: 0, correct: 0, answers: 0, byTheme: {}, recent: [] };
		}

		async function loadProgress(user) {
			const { data, error } = await supabaseClient.from("quiz_progress").select("quiz_count, correct_count, answer_count, by_theme, recent").eq("user_id", user.id).maybeSingle();
			if (error) throw error;
			progressData = data ? {
				quizzes: data.quiz_count,
				correct: data.correct_count,
				answers: data.answer_count,
				byTheme: data.by_theme || {},
				recent: Array.isArray(data.recent) ? data.recent : []
			} : createEmptyProgress();
		}

		async function saveProgress() {
			const status = document.querySelector("#sync-status");
			if (!supabaseClient || !currentUser) return;
			const { error } = await supabaseClient.from("quiz_progress").upsert({
				user_id: currentUser.id,
				quiz_count: progressData.quizzes,
				correct_count: progressData.correct,
				answer_count: progressData.answers,
				by_theme: progressData.byTheme,
				recent: progressData.recent
			}, { onConflict: "user_id" });
			if (error) {
				console.error("La progression n'a pas pu être synchronisée.", error);
				status.textContent = "La progression n’a pas pu être synchronisée.";
				return;
			}
			status.textContent = "Progression synchronisée.";
		}

		function currentProfile() {
			return progressData;
		}

		function renderTopics() {
			const grid = document.querySelector("#topic-grid");
			grid.replaceChildren();
			Object.entries(quizData).forEach(([id, theme]) => {
				const progress = currentProfile().byTheme[id];
				const button = document.createElement("button");
				button.className = "topic";
				button.type = "button";
				button.dataset.theme = id;
				button.setAttribute("aria-pressed", String(id === activeTheme));
				button.innerHTML = `<span class="topic-progress">${progress?.quizzes || 0} quiz</span><span class="topic-symbol" aria-hidden="true"><img src="images/${themeIcons[id]}" alt=""></span><span class="topic-title"></span><span class="topic-meta">${theme.series.length} séries · ${theme.series.reduce((total, series) => total + series.questions.length, 0)} questions</span>`;
				button.querySelector(".topic-title").textContent = theme.name;
				button.addEventListener("click", () => {
					activeTheme = id;
					activeSeriesId = quizData[id].series[0].id;
					grid.querySelectorAll(".topic").forEach((topicButton) => topicButton.setAttribute("aria-pressed", String(topicButton.dataset.theme === id)));
					document.querySelector("#series-search").value = "";
					document.querySelector("#series-category-filter").value = "all";
					renderSeries();
				});
				grid.append(button);
			});
			requestAnimationFrame(updateTopicNavigation);
		}

		function updateTopicNavigation() {
			const grid = document.querySelector("#topic-grid");
			const canScroll = grid.scrollWidth > grid.clientWidth + 1;
			document.querySelector("#topics-previous").disabled = !canScroll || grid.scrollLeft <= 1;
			document.querySelector("#topics-next").disabled = !canScroll || grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 1;
		}

		function scrollTopics(direction) {
			const grid = document.querySelector("#topic-grid");
			grid.scrollBy({ left: direction * grid.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
		}

		function renderSeries() {
			const theme = quizData[activeTheme];
			const list = document.querySelector("#series-list");
			document.querySelector("#series-title-text").textContent = `Séries · ${theme.name}`;
			const categoryFilter = document.querySelector("#series-category-filter");
			const selectedCategory = categoryFilter.value || "all";
			const categories = [...new Set(theme.series.map((series) => series.category || "Autres"))].sort((first, second) => first.localeCompare(second, "fr"));
			categoryFilter.replaceChildren(new Option("Toutes les catégories", "all"), ...categories.map((category) => new Option(category, category)));
			categoryFilter.value = categories.includes(selectedCategory) ? selectedCategory : "all";
			const normalizedQuery = document.querySelector("#series-search").value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
			const filteredSeries = theme.series.map((series, index) => ({ series, index })).filter(({ series }) => {
				const matchesCategory = categoryFilter.value === "all" || series.category === categoryFilter.value;
				const searchableText = `${series.name} ${series.category || ""}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
				return matchesCategory && searchableText.includes(normalizedQuery);
			});
			document.querySelector("#series-result-count").textContent = `${filteredSeries.length} série${filteredSeries.length > 1 ? "s" : ""}`;
			if (!filteredSeries.some(({ series }) => series.id === activeSeriesId)) activeSeriesId = filteredSeries[0]?.series.id || null;
			document.querySelector("#start-quiz").disabled = !activeSeriesId;
			list.replaceChildren();
			if (!filteredSeries.length) {
				const empty = document.createElement("p");
				empty.className = "empty-state series-empty";
				empty.textContent = "Aucune série ne correspond à ta recherche.";
				list.append(empty);
				return;
			}
			filteredSeries.forEach(({ series, index }) => {
				const row = document.createElement("button");
				row.className = "series-row";
				row.type = "button";
				row.setAttribute("aria-pressed", String(series.id === activeSeriesId));
				row.innerHTML = `<span class="series-info"><span class="series-number">${String(index + 1).padStart(2, "0")}</span><span class="series-copy"><span class="series-name"></span><span class="series-category">${series.category || "Autres"}</span><span class="series-detail"><img src="images/schedule.svg" alt="" aria-hidden="true"> ${series.questions.length} questions · environ ${Math.max(2, Math.ceil(series.questions.length * 0.7))} min</span></span></span><span class="series-select" aria-hidden="true">${series.id === activeSeriesId ? '<img src="images/check_circle.svg" alt="">' : ""}</span>`;
				row.querySelector(".series-name").textContent = series.name;
				row.addEventListener("click", () => {
					activeSeriesId = series.id;
					renderSeries();
				});
				list.append(row);
			});
		}

		function renderDashboard() {
			const profile = currentProfile();
			const percent = profile.answers ? Math.round(profile.correct / profile.answers * 100) : 0;
			const user = currentUser || { email: "", user_metadata: {}, app_metadata: {} };
			const accountName = user.user_metadata?.display_name || (user.email ? user.email.split("@")[0] : "Utilisateur");
			document.querySelector("#account-email").textContent = user.email || "";
			document.querySelector("#welcome-name").textContent = accountName;
			document.querySelector("#open-admin").hidden = user.app_metadata?.role !== "admin";
			document.querySelector("#stat-quizzes").textContent = profile.quizzes;
			document.querySelector("#stat-score").textContent = `${percent}%`;
			document.querySelector("#stat-answers").textContent = profile.answers;
			document.querySelector("#progress-percent").textContent = `${percent}%`;
			document.querySelector("#progress-ring").style.setProperty("--progress", `${percent * 3.6}deg`);
			document.querySelector("#progress-label").textContent = profile.quizzes ? `${profile.quizzes} quiz termin${profile.quizzes > 1 ? "és" : "é"}` : "À toi de jouer";
			document.querySelector("#progress-description").textContent = profile.answers ? `${profile.correct} bonnes réponses sur ${profile.answers}. Continue comme ça !` : "Termine un quiz pour voir tes progrès ici.";
			document.querySelector("#streak-value").textContent = `${profile.quizzes} session${profile.quizzes > 1 ? "s" : ""}`;
			renderTopics();
			renderRecent(profile.recent || []);
		}

		function renderRecent(recent) {
			const list = document.querySelector("#recent-list");
			list.replaceChildren();
			if (!recent.length) {
				const empty = document.createElement("p");
				empty.className = "empty-state";
				empty.textContent = "Tes quiz terminés apparaîtront ici.";
				list.append(empty);
				return;
			}
			recent.slice(0, 4).forEach((item) => {
				const row = document.createElement("div");
				row.className = "recent-item";
				row.innerHTML = `<span class="recent-dot" aria-hidden="true"></span><span class="recent-text"><strong></strong><span></span></span>`;
				row.querySelector("strong").textContent = item.series;
				row.querySelector("span span").textContent = `${item.score}/${item.total} bonnes réponses · ${item.theme}`;
				list.append(row);
			});
		}

		function normalizeAnswer(value) {
			return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
		}

		function startQuiz() {
			const theme = quizData[activeTheme];
			const series = theme?.series?.find((item) => item.id === activeSeriesId);
			if (!theme || !series || !series.questions?.length) return;
			let questions = series.questions.map((question) => ({ ...question, choices: [...question.choices] }));
			if (document.querySelector("#shuffle-questions").checked) questions = questions.sort(() => Math.random() - 0.5);
			const requestedCount = document.querySelector("#question-count").value;
			if (requestedCount !== "all") questions = questions.slice(0, Number(requestedCount));
			if (!questions.length) return;
			quizSession = { theme: activeTheme, series, questions, index: 0, responses: [], waiting: false, immediate: document.querySelector("#show-feedback").checked };
			document.querySelector("#quiz-dialog-title").textContent = quizData[activeTheme].name;
			document.querySelector("#quiz-series-name").textContent = series.name;
			document.querySelector("#quiz-content").hidden = false;
			document.querySelector("#result-content").hidden = true;
			renderQuestion();
			document.querySelector("#quiz-dialog").showModal();
		}

		function renderQuestion() {
			if (!quizSession || !quizSession.questions?.length) return;
			const question = quizSession.questions[quizSession.index];
			if (!question) return;
			const count = quizSession.questions.length;
			const progress = Math.round((quizSession.index + 1) / count * 100);
			const format = activeMode === "aleatoire" ? (Math.random() < 0.5 ? "qcm" : "texte") : activeMode;
			quizSession.currentFormat = format;
			quizSession.waiting = false;
			document.querySelector("#question-count-label").textContent = `Question ${quizSession.index + 1} sur ${count}`;
			document.querySelector("#question-percent").textContent = `${progress}%`;
			const progressStep = Math.round(progress / 20);
			document.querySelector("#question-progress-dots").src = `images/progress_bar/barre-de-progression-${progressStep}-sur-5.svg`;
			document.querySelector("#question-topic").textContent = format === "texte" ? "Réponse écrite" : "À toi de choisir";
			document.querySelector("#question-title").textContent = question.prompt;
			document.querySelector("#answer-feedback").hidden = true;
			document.querySelector("#next-question").hidden = true;
			document.querySelector("#submit-text").hidden = true;
			const area = document.querySelector("#answer-area");
			area.replaceChildren();
			if (format === "texte") {
				const input = document.createElement("input");
				input.className = "text-answer";
				input.id = "text-answer";
				input.type = "text";
				input.autocomplete = "off";
				input.placeholder = "Écris ta réponse…";
				input.setAttribute("aria-label", "Ta réponse");
				input.addEventListener("keydown", (event) => { if (event.key === "Enter") submitTextAnswer(); });
				area.append(input);
				document.querySelector("#submit-text").hidden = false;
				input.focus();
			} else {
				const choices = question.choices.map((choice, index) => ({ choice, index })).sort(() => Math.random() - 0.5);
				const list = document.createElement("div");
				list.className = "answer-list";
				choices.forEach(({ choice, index }, displayIndex) => {
					const button = document.createElement("button");
					button.className = "answer-choice";
					button.type = "button";
					button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + displayIndex)}</span><span class="answer-copy"></span>`;
					button.querySelector(".answer-copy").textContent = choice;
					button.addEventListener("click", () => submitAnswer(index, choice, button));
					list.append(button);
				});
				area.append(list);
			}
		}

		function submitTextAnswer() {
			if (!quizSession || !quizSession.questions?.length) return;
			if (quizSession.waiting) return;
			const input = document.querySelector("#text-answer");
			const value = input?.value?.trim();
			if (!value) { input?.focus(); return; }
			const question = quizSession.questions[quizSession.index];
			if (!question) return;
			const correct = question.accepted.some((answer) => normalizeAnswer(answer) === normalizeAnswer(value));
			submitAnswer(question.answer, value, null, correct);
		}

		function submitAnswer(answerIndex, answerText, selectedButton, textResult) {
			if (!quizSession || !quizSession.questions?.length) return;
			if (quizSession.waiting) return;
			const question = quizSession.questions[quizSession.index];
			if (!question) return;
			const correct = typeof textResult === "boolean" ? textResult : answerIndex === question.answer;
			quizSession.responses.push({ question, answerText, correct });
			if (!quizSession.immediate) {
				advanceQuestion();
				return;
			}
			quizSession.waiting = true;
			document.querySelectorAll(".answer-choice").forEach((button) => {
				button.disabled = true;
				const choiceText = button.querySelector(".answer-copy").textContent;
				if (choiceText === question.choices[question.answer]) button.classList.add("is-correct");
				if (button === selectedButton && !correct) button.classList.add("is-wrong");
			});
			const feedback = document.querySelector("#answer-feedback");
			feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
			const feedbackIcon = document.createElement("img");
			feedbackIcon.src = `images/${correct ? "check_circle" : "close"}.svg`;
			feedbackIcon.alt = "";
			feedbackIcon.setAttribute("aria-hidden", "true");
			const feedbackText = document.createElement("span");
			feedbackText.textContent = `${correct ? "Bonne réponse." : `Pas tout à fait. Réponse : ${question.choices[question.answer]}.`} ${question.explanation}`;
			feedback.replaceChildren(feedbackIcon, feedbackText);
			feedback.hidden = false;
			document.querySelector("#submit-text").hidden = true;
			const nextButton = document.querySelector("#next-question");
			nextButton.innerHTML = `<img src="images/arrow_forward.svg" alt="" aria-hidden="true"> ${quizSession.index === quizSession.questions.length - 1 ? "Voir mon résultat" : "Question suivante"}`;
			nextButton.hidden = false;
			nextButton.focus();
		}

		function advanceQuestion() {
			if (!quizSession || !quizSession.questions?.length) return;
			if (quizSession.index + 1 < quizSession.questions.length) {
				quizSession.index += 1;
				renderQuestion();
			} else {
				showResults();
			}
		}

		function showResults() {
			if (!quizSession || !quizSession.questions?.length) return;
			const score = quizSession.responses.filter((response) => response.correct).length;
			const total = quizSession.questions.length;
			const profile = currentProfile();
			profile.quizzes += 1;
			profile.correct += score;
			profile.answers += total;
			profile.byTheme[quizSession.theme] ||= { quizzes: 0, correct: 0, answers: 0 };
			profile.byTheme[quizSession.theme].quizzes += 1;
			profile.byTheme[quizSession.theme].correct += score;
			profile.byTheme[quizSession.theme].answers += total;
			profile.recent.unshift({ series: quizSession.series.name, theme: quizData[quizSession.theme].name, score, total, date: new Date().toISOString() });
			profile.recent = profile.recent.slice(0, 4);
			document.querySelector("#result-number").textContent = `${score}/${total}`;
			document.querySelector("#result-title").textContent = score === total ? "Tout juste !" : score >= total / 2 ? "Bien joué, continue !" : "Chaque essai te fait avancer.";
			document.querySelector("#result-caption").textContent = `${quizData[quizSession.theme].name} · ${quizSession.series.name}`;
			const review = document.querySelector("#review-list");
			review.replaceChildren();
			quizSession.responses.forEach((response, index) => {
				const item = document.createElement("div");
				item.className = "review-item";
				const title = document.createElement("strong");
				title.textContent = `${index + 1}. ${response.question.prompt}`;
				const answer = document.createElement("span");
				answer.className = response.correct ? "review-correct" : "review-wrong";
				const answerIcon = document.createElement("img");
				answerIcon.src = `images/${response.correct ? "check_circle" : "close"}.svg`;
				answerIcon.alt = "";
				answerIcon.setAttribute("aria-hidden", "true");
				const answerText = document.createElement("span");
				answerText.textContent = `${response.correct ? "Correct" : `Ta réponse : ${response.answerText}. Réponse attendue : ${response.question.choices[response.question.answer]}.`} ${response.question.explanation}`;
				answer.append(answerIcon, answerText);
				item.append(title, answer);
				review.append(item);
			});
			document.querySelector("#quiz-content").hidden = true;
			document.querySelector("#result-content").hidden = false;
			renderDashboard();
			void saveProgress();
		}

		const modeSwitch = document.querySelector("#mode-switch");
		function syncModeIndicator(button) {
			const switchRect = modeSwitch.getBoundingClientRect();
			const buttonRect = button.getBoundingClientRect();
			modeSwitch.style.setProperty("--indicator-left", `${buttonRect.left - switchRect.left - modeSwitch.clientLeft}px`);
			modeSwitch.style.setProperty("--indicator-width", `${buttonRect.width}px`);
		}

		function setAuthFeedback(message, isError = false) {
			const feedback = document.querySelector("#auth-feedback");
			feedback.textContent = message;
			feedback.hidden = !message;
			feedback.classList.toggle("is-error", isError);
		}

		function showLogin(message = "") {
			document.querySelector("#auth-screen").hidden = false;
			document.querySelector("#app-shell").hidden = true;
			document.querySelector("#auth-title").textContent = "Connecte-toi pour réviser";
			document.querySelector("#auth-copy").textContent = "Ta progression est sauvegardée sur ton compte.";
			document.querySelector("#login-form").hidden = false;
			document.querySelector("#signup-form").hidden = true;
			document.querySelector("#password-setup-form").hidden = true;
			document.querySelector("#mfa-form").hidden = true;
			document.querySelector("#auth-mode-toggle").hidden = false;
			document.querySelector("#auth-mode-toggle").textContent = "Créer un compte";
			document.querySelector("#request-password-reset").hidden = false;
			setAuthFeedback(message);
		}

		function showSignup() {
			document.querySelector("#auth-screen").hidden = false;
			document.querySelector("#app-shell").hidden = true;
			document.querySelector("#auth-title").textContent = "Crée ton compte CodeBook";
			document.querySelector("#auth-copy").textContent = "Retrouve ta progression sur tous tes appareils.";
			document.querySelector("#login-form").hidden = true;
			document.querySelector("#signup-form").hidden = false;
			document.querySelector("#password-setup-form").hidden = true;
			document.querySelector("#mfa-form").hidden = true;
			document.querySelector("#auth-mode-toggle").hidden = false;
			document.querySelector("#auth-mode-toggle").textContent = "J’ai déjà un compte";
			document.querySelector("#request-password-reset").hidden = true;
			setAuthFeedback("");
		}

		function showPasswordSetup(session) {
			currentUser = session?.user || currentUser;
			document.querySelector("#auth-screen").hidden = false;
			document.querySelector("#app-shell").hidden = true;
			document.querySelector("#auth-title").textContent = "Définis ton nouveau mot de passe";
			document.querySelector("#auth-copy").textContent = "Choisis un mot de passe sécurisé pour ton compte.";
			document.querySelector("#login-form").hidden = true;
			document.querySelector("#signup-form").hidden = true;
			document.querySelector("#password-setup-form").hidden = false;
			document.querySelector("#mfa-form").hidden = true;
			document.querySelector("#auth-mode-toggle").hidden = true;
			document.querySelector("#request-password-reset").hidden = true;
			setAuthFeedback("Choisis un mot de passe d’au moins 12 caractères.");
		}

		function showMfaForm(prompt, enrollment = null) {
			document.querySelector("#auth-screen").hidden = false;
			document.querySelector("#app-shell").hidden = true;
			document.querySelector("#auth-title").textContent = "Vérification de sécurité";
			document.querySelector("#auth-copy").textContent = "Confirme ton identité pour continuer.";
			document.querySelector("#login-form").hidden = true;
			document.querySelector("#signup-form").hidden = true;
			document.querySelector("#password-setup-form").hidden = true;
			document.querySelector("#mfa-form").hidden = false;
			document.querySelector("#auth-mode-toggle").hidden = true;
			document.querySelector("#request-password-reset").hidden = true;
			document.querySelector("#mfa-prompt").textContent = prompt;
			const enrollmentPanel = document.querySelector("#mfa-enrollment");
			enrollmentPanel.hidden = !enrollment;
			if (enrollment) {
				document.querySelector("#mfa-qr").src = enrollment.qrCode;
				document.querySelector("#mfa-secret").textContent = enrollment.secret;
			}
			setAuthFeedback("");
		}

		function clearAuthFlow() {
			const url = new URL(window.location.href);
			url.searchParams.delete("flow");
			window.history.replaceState({}, "", url);
		}

		function getAuthRedirectUrl(flow = "") {
			const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
			const redirect = new URL(isLocal ? window.location.href : window.SUPABASE_CONFIG.appUrl || window.location.href);
			redirect.searchParams.delete("flow");
			if (flow) redirect.searchParams.set("flow", flow);
			return redirect.toString();
		}

		async function activateSession(session) {
			if (!session?.user) {
				currentUser = null;
				loadedUserId = null;
				progressData = createEmptyProgress();
				showLogin();
				return;
			}
			if (loadedUserId === session.user.id) return;
			currentUser = session.user;
			loadedUserId = session.user.id;
			document.querySelector("#auth-screen").hidden = true;
			document.querySelector("#app-shell").hidden = false;
			document.querySelector("#sync-status").textContent = "Chargement de ta progression…";
			try {
				await loadProgress(currentUser);
				document.querySelector("#sync-status").textContent = "";
			} catch (error) {
				console.error("La progression distante n'a pas pu être chargée.", error);
				progressData = createEmptyProgress();
				document.querySelector("#sync-status").textContent = "La progression distante est momentanément indisponible.";
			}
			renderDashboard();
			renderSeries();
			requestAnimationFrame(() => syncModeIndicator(document.querySelector('.mode-button[aria-pressed="true"]')));
		}

		async function handleAuthSession(event, session) {
			if (!session) {
				await activateSession(null);
				return;
			}
			const flow = new URLSearchParams(window.location.search).get("flow");
			if (passwordSetupInProgress) return;
			if (event === "PASSWORD_RECOVERY" || flow === "invite" || flow === "recovery") {
				showPasswordSetup(session);
				return;
			}
			if (session.user.app_metadata?.role === "admin") {
				if (adminMfaPending) return;
				adminMfaPending = true;
				try {
					if (!await requireAdminMfa(session)) return;
				} finally {
					adminMfaPending = false;
				}
			}
			await activateSession(session);
		}

		async function requireAdminMfa(session) {
			const { data: assurance, error: assuranceError } = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();
			if (assuranceError) {
				showLogin("La vérification de sécurité a échoué. Reconnecte-toi.");
				return false;
			}
			if (assurance.currentLevel === "aal2") return true;
			if (!document.querySelector("#mfa-form").hidden && mfaFactorId) return false;

			const { data: factors, error: factorsError } = await supabaseClient.auth.mfa.listFactors();
			if (factorsError) {
				showLogin("Le second facteur n’a pas pu être vérifié. Réessaie.");
				return false;
			}
			let factor = (factors.totp || []).find((item) => item.status === "verified");
			let enrollment = null;
			if (!factor) {
				const { data, error } = await supabaseClient.auth.mfa.enroll({ factorType: "totp", friendlyName: "CodeBook admin" });
				if (error) {
					showLogin("Le second facteur n’a pas pu être configuré. Contacte l’administrateur du projet.");
					return false;
				}
				factor = data;
				enrollment = { qrCode: data.totp.qr_code, secret: data.totp.secret };
			}
			mfaFactorId = factor.id;
			const { data: challenge, error: challengeError } = await supabaseClient.auth.mfa.challenge({ factorId: mfaFactorId });
			if (challengeError) {
				showLogin("Le code de vérification n’a pas pu être demandé. Réessaie.");
				return false;
			}
			mfaChallengeId = challenge.id;
			showMfaForm(enrollment ? "Scanne ce code avec une application d’authentification, puis saisis le code affiché." : "Saisis le code à 6 chiffres de ton application d’authentification.", enrollment);
			return false;
		}

		async function initializeAuth() {
			const configMessage = document.querySelector("#auth-config-message");
			const config = window.SUPABASE_CONFIG;
			if (!window.supabase?.createClient || !config?.url || !config?.anonKey) {
				showLogin();
				configMessage.textContent = "La connexion n’est pas configurée. Ajoute l’URL et la clé publique de ton projet Supabase dans supabase-config.js.";
				configMessage.hidden = false;
				document.querySelectorAll("#login-form input, #login-form button, #signup-form input, #signup-form button, #auth-mode-toggle, #request-password-reset").forEach((control) => { control.disabled = true; });
				return;
			}

			supabaseClient = window.supabase.createClient(config.url, config.anonKey, { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } });
			window.supabaseClient = supabaseClient;
			supabaseClient.auth.onAuthStateChange((event, session) => {
				window.setTimeout(() => { void handleAuthSession(event, session); }, 0);
			});

			document.querySelector("#login-form").addEventListener("submit", async (event) => {
				event.preventDefault();
				setAuthFeedback("");
				const button = event.currentTarget.querySelector("button[type=submit]");
				button.disabled = true;
				const { error } = await supabaseClient.auth.signInWithPassword({
					email: document.querySelector("#auth-email").value.trim(),
					password: document.querySelector("#auth-password").value
				});
				button.disabled = false;
				if (error) setAuthFeedback("Adresse e-mail ou mot de passe invalide.", true);
			});

			document.querySelector("#auth-mode-toggle").addEventListener("click", () => {
				if (document.querySelector("#signup-form").hidden) showSignup();
				else showLogin();
			});

			document.querySelector("#signup-form").addEventListener("submit", async (event) => {
				event.preventDefault();
				const email = document.querySelector("#signup-email").value.trim();
				const password = document.querySelector("#signup-password").value;
				if (password.length < 12 || password !== document.querySelector("#signup-password-confirm").value) {
					setAuthFeedback(password.length < 12 ? "Le mot de passe doit contenir au moins 12 caractères." : "Les deux mots de passe ne correspondent pas.", true);
					return;
				}
				if (window.location.protocol === "file:") {
					setAuthFeedback("Ouvre l’application depuis son adresse web configurée pour créer un compte.", true);
					return;
				}
				const button = event.currentTarget.querySelector("button[type=submit]");
				button.disabled = true;
				const { data, error } = await supabaseClient.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: getAuthRedirectUrl() }
				});
				button.disabled = false;
				if (error) {
					setAuthFeedback("Le compte n’a pas pu être créé. Vérifie les informations et réessaie.", true);
					return;
				}
				if (!data.session) {
					document.querySelector("#auth-email").value = email;
					showLogin("Si cette adresse peut être inscrite, tu recevras un e-mail pour confirmer ton compte.");
				}
			});

			document.querySelector("#request-password-reset").addEventListener("click", async () => {
				const email = document.querySelector("#auth-email").value.trim();
				if (!email) {
					setAuthFeedback("Saisis ton adresse e-mail pour recevoir les instructions.", true);
					return;
				}
				if (window.location.protocol === "file:") {
					setAuthFeedback("Ouvre l’application depuis son adresse web configurée pour demander une récupération.", true);
					return;
				}
				const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: getAuthRedirectUrl("recovery") });
				setAuthFeedback(error ? "La demande n’a pas pu être envoyée. Réessaie plus tard." : "Si un compte correspond à cette adresse, tu recevras un e-mail de récupération.", Boolean(error));
			});

			document.querySelector("#mfa-form").addEventListener("submit", async (event) => {
				event.preventDefault();
				const code = document.querySelector("#mfa-code").value.trim();
				const { error } = await supabaseClient.auth.mfa.verify({ factorId: mfaFactorId, challengeId: mfaChallengeId, code });
				if (error) {
					setAuthFeedback("Code invalide ou expiré. Vérifie l’heure de ton appareil et réessaie.", true);
					const { data: challenge } = await supabaseClient.auth.mfa.challenge({ factorId: mfaFactorId });
					mfaChallengeId = challenge?.id || mfaChallengeId;
					return;
				}
				const { data } = await supabaseClient.auth.getSession();
				await handleAuthSession("MFA_VERIFIED", data.session);
			});

			document.querySelector("#password-setup-form").addEventListener("submit", async (event) => {
				event.preventDefault();
				const password = document.querySelector("#new-password").value;
				if (password.length < 12 || password !== document.querySelector("#confirm-password").value) {
					setAuthFeedback(password.length < 12 ? "Le mot de passe doit contenir au moins 12 caractères." : "Les deux mots de passe ne correspondent pas.", true);
					return;
				}
				passwordSetupInProgress = true;
				const { error } = await supabaseClient.auth.updateUser({ password });
				passwordSetupInProgress = false;
				if (error) {
					setAuthFeedback("Le mot de passe n’a pas pu être enregistré. Réessaie.", true);
					return;
				}
				clearAuthFlow();
				const { data } = await supabaseClient.auth.getSession();
				await handleAuthSession("PASSWORD_SET", data.session);
			});

			document.querySelector("#sign-out").addEventListener("click", async () => {
				await supabaseClient.auth.signOut();
			});
			document.querySelector("#open-admin").addEventListener("click", () => {
				if (currentUser?.app_metadata?.role === "admin") document.querySelector("#admin-dialog").showModal();
			});
			document.querySelector("#invite-user-form").addEventListener("submit", async (event) => {
				event.preventDefault();
				const feedback = document.querySelector("#invite-feedback");
				if (currentUser?.app_metadata?.role !== "admin") return;
				const email = document.querySelector("#invite-email").value.trim();
				const { error } = await supabaseClient.functions.invoke("admin-invite-user", { body: { email } });
				feedback.textContent = error ? "Invitation impossible. Vérifie les droits admin et la configuration serveur." : "Invitation envoyée.";
				if (!error) document.querySelector("#invite-email").value = "";
			});

			const { data, error } = await supabaseClient.auth.getSession();
			if (error) {
				showLogin("La session n’a pas pu être vérifiée. Réessaie.");
				return;
			}
			await handleAuthSession("INITIAL_SESSION", data.session);
		}

		document.querySelectorAll(".mode-button").forEach((button) => button.addEventListener("click", () => {
			activeMode = button.dataset.mode;
			document.querySelectorAll(".mode-button").forEach((modeButton) => modeButton.setAttribute("aria-pressed", String(modeButton === button)));
			document.querySelector("#mode-caption").textContent = modeCaptions[activeMode];
			syncModeIndicator(button);
		}));
		syncModeIndicator(document.querySelector('.mode-button[aria-pressed="true"]'));
		document.querySelector("#topics-previous").addEventListener("click", () => scrollTopics(-1));
		document.querySelector("#topics-next").addEventListener("click", () => scrollTopics(1));
		document.querySelector("#topic-grid").addEventListener("scroll", updateTopicNavigation, { passive: true });
		document.querySelector("#series-search").addEventListener("input", renderSeries);
		document.querySelector("#series-category-filter").addEventListener("change", renderSeries);
		window.addEventListener("resize", () => {
			syncModeIndicator(document.querySelector('.mode-button[aria-pressed="true"]'));
			updateTopicNavigation();
		});
		document.querySelector("#start-quiz").addEventListener("click", startQuiz);
		document.querySelector("#next-question").addEventListener("click", advanceQuestion);
		document.querySelector("#submit-text").addEventListener("click", submitTextAnswer);
		document.querySelector("#finish-quiz").addEventListener("click", () => document.querySelector("#quiz-dialog").close());
		document.querySelector("#open-help").addEventListener("click", () => document.querySelector("#help-dialog").showModal());
		document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.close).close()));
		document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }));
		async function initializeApp() {
			try {
				await initializeQuizData();
			} catch (error) {
				console.error(error);
			}
			initializeAuth();
		}
		initializeApp();