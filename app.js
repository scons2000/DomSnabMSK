// ДомСнаб Front-End Engine 
document.addEventListener("DOMContentLoaded", () => {
    initCMSData();
    renderQuiz();
    setupQuizLogic();
});

// 1. Инициализация контента из CMS
function initCMSData() {
    // Контакты
    document.getElementById("cms-phone-header").innerText = DomSnabCMS.contacts.phone;
    document.getElementById("cms-phone-header").href = DomSnabCMS.contacts.phoneLink;
    document.getElementById("cms-phone-footer").innerText = DomSnabCMS.contacts.phone;
    document.getElementById("cms-phone-footer").href = DomSnabCMS.contacts.phoneLink;
    document.getElementById("cms-wa-header").href = DomSnabCMS.contacts.whatsapp;
    document.getElementById("cms-tg-header").href = DomSnabCMS.contacts.telegram;

    if(document.getElementById("cms-header-desc")) {
        document.getElementById("cms-header-desc").innerText = DomSnabCMS.contacts.headerDescriptor;
    }
    if(document.getElementById("cms-footer-desc")) {
        document.getElementById("cms-footer-desc").innerText = DomSnabCMS.contacts.footerDescriptor;
    }

    // Тексты
    document.getElementById("cms-hero-title").innerHTML = DomSnabCMS.promo.heroTitle;
    document.getElementById("cms-hero-desc").innerText = DomSnabCMS.promo.heroDesc;
    document.getElementById("cms-gifts-deadline").innerText = DomSnabCMS.promo.giftDeadlineText;
    document.getElementById("cms-gifts-counter").innerText = DomSnabCMS.promo.socialProofCounter;
    document.getElementById("cms-form-title").innerText = DomSnabCMS.promo.formTitle;

    // Тексты для подзаголовка формы и кнопок CTA
    if (DomSnabCMS.promo.formSubtitle && document.getElementById("cms-form-subtitle")) {
        document.getElementById("cms-form-subtitle").innerText = DomSnabCMS.promo.formSubtitle;
    }
    if (DomSnabCMS.promo.ctaButtonText) {
        const heroCta = document.getElementById("cms-hero-cta");
        if (heroCta) heroCta.innerText = DomSnabCMS.promo.ctaButtonText;
        
        const formBtn = document.getElementById("cms-form-btn");
        if (formBtn) formBtn.innerText = DomSnabCMS.promo.ctaButtonText;
    }

    // Рендер чипсов/чекбоксов инженерных систем для аудита
    const systemsGrid = document.getElementById("cms-audit-systems-grid");
    if (systemsGrid && DomSnabCMS.auditSystemsList) {
        systemsGrid.innerHTML = DomSnabCMS.auditSystemsList.map(sys => `
            <label style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s;">
                <input type="checkbox" name="audit_systems" value="${sys.label}" style="width: 16px; height: 16px; accent-color: var(--primary-bg);">
                <span>${sys.label}</span>
            </label>
        `).join('');
    }

    // Рендер болей (Блок 4)
    const problemsContainer = document.getElementById("cms-problems-container");
    if (problemsContainer) {
        problemsContainer.innerHTML = DomSnabCMS.problems.map(item => `
            <div class="problem-card">
                <span class="card-emoji">${item.emoji}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        `).join('');
    }

    // Рендер состава аудита
    const auditContainer = document.getElementById("cms-audit-container");
    if (auditContainer) {
        auditContainer.innerHTML = DomSnabCMS.auditItems.map(item => `
            <div class="audit-item">
                <span class="item-emoji">${item.emoji}</span>
                <div>
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('');
    }

    // Вертикальный интерактивный список подарков
    const giftsContainer = document.getElementById("vertical-gifts-list");
    if (giftsContainer && DomSnabCMS.gifts) {
        giftsContainer.innerHTML = "";
        DomSnabCMS.gifts.forEach((gift, index) => {
            const label = document.createElement("label");
            label.className = "vertical-gift-item";
            label.style = "background: #FFFFFF; padding: 14px 20px; border-radius: 8px; border: 1px solid #E5E7EB; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: all 0.2s;";
            
            label.innerHTML = `
                <span style="font-size: 22px;">${gift.emoji}</span>
                <div style="flex-grow: 1;">
                    <strong class="gift-name" style="color: #1F2937; display: block; font-size: 15px;">${gift.name}</strong>
                    <span style="font-size: 13px; color: #6B7280;">${gift.desc}</span>
                </div>
                <input type="radio" name="user_chosen_gift" value="${gift.name}" style="width: 18px; height: 18px; cursor: pointer;">
            `;
            
            // Механика клика на подарок
            label.addEventListener("change", () => {
                document.querySelectorAll(".vertical-gift-item").forEach(el => {
                    el.style.borderColor = "#E5E7EB";
                    el.style.backgroundColor = "#FFFFFF";
                });
                
                label.style.borderColor = "var(--accent-color)";
                label.style.backgroundColor = "#FFF9F2";
                
                const commentInput = document.getElementById("comment");
                if (commentInput) {
                    commentInput.value = `Выбранный подарок при оформлении заявки: пошаговый чек-лист и ${gift.name}.`;
                }

                // Обновление скрытого поля
                const hiddenGifts = document.getElementById("hidden_chosen_gifts");
                if (hiddenGifts) {
                    hiddenGifts.value = `Чек-лист ТО, ${gift.name}`;
                }

                const orderForm = document.getElementById("order-form");
                if (orderForm) {
                    setTimeout(() => {
                        orderForm.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            });

            giftsContainer.appendChild(label);
        });
    }

    // Выпадающий список поселков
    const selectLocation = document.getElementById("location");
    if (selectLocation && DomSnabCMS.locations) {
        selectLocation.innerHTML = '<option value="" disabled selected>Выберите посёлок</option>';
        DomSnabCMS.locations.forEach(loc => {
            const opt = document.createElement("option");
            opt.value = loc;
            opt.innerText = loc;
            selectLocation.appendChild(opt);
        });
    }

    // Список на карте
    const mapLocations = document.getElementById("cms-map-locations-list");
    if (mapLocations && DomSnabCMS.locations) {
        mapLocations.innerText = DomSnabCMS.locations.join(" • ");
    }
}

// 2. Генерация разметки квиза на основе JSON-базы вопросов
function renderQuiz() {
    const quizContainer = document.getElementById("dynamic-questions-container");
    if (!quizContainer) return;
    
    quizContainer.innerHTML = DomSnabCMS.quizQuestions.map((q, index) => `
        <div class="quiz-step ${index === 0 ? 'active' : ''}" data-step="${index + 1}">
            <p class="quiz-question">${q.id}. ${q.question}</p>
            <div class="quiz-options">
                ${q.options.map(opt => `
                    <label class="option-label">
                        <input type="radio" name="q${q.id}" value="${opt.score}" required>
                        ${opt.text}
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    const inputs = quizContainer.querySelectorAll('.quiz-options input');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const stepOptions = this.closest('.quiz-options').querySelectorAll('.option-label');
            stepOptions.forEach(label => label.classList.remove('selected'));
            if (this.checked) {
                this.closest('.option-label').classList.add('selected');
            }
        });
    });
}

// 3. Алгоритмы переходов и аналитики квиза
let currentStep = 1;

function setupQuizLogic() {
    const totalSteps = DomSnabCMS.quizQuestions ? DomSnabCMS.quizQuestions.length : 0;
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const progressFill = document.getElementById('progress-fill');
    const progressLabel = document.getElementById('progress-step-label');
    const progressPercent = document.getElementById('progress-percent');
    const navActions = document.getElementById('quiz-nav-actions');

    if (!btnNext || !btnBack) return;

    function updateProgressBar() {
        btnBack.disabled = (currentStep === 1);
        progressLabel.innerText = `Вопрос ${currentStep} из ${totalSteps}`;
        const percent = Math.round((currentStep / totalSteps) * 100);
        progressPercent.innerText = `${percent}%`;
        progressFill.style.width = `${percent}%`;
        btnNext.innerText = (currentStep === totalSteps) ? 'Узнать результат' : 'Далее';
    }

    updateProgressBar();

    btnNext.addEventListener('click', () => {
        const currentStepEl = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
        const anySelected = currentStepEl.querySelector('input:checked');
        
        if (!anySelected && currentStep <= totalSteps) {
            alert('Пожалуйста, выберите один из вариантов ответа.');
            return;
        }

        if (currentStep < totalSteps) {
            currentStepEl.classList.remove('active');
            currentStep++;
            document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.add('active');
            updateProgressBar();
        } else if (currentStep === totalSteps) {
            let score = 0;
            for (let i = 1; i <= totalSteps; i++) {
                const checked = document.querySelector(`input[name="q${i}"]:checked`);
                if (checked) score += parseInt(checked.value);
            }

            currentStepEl.classList.remove('active');
            navActions.style.display = 'none';
            document.getElementById('quiz-result-step').classList.add('active');

            const titleEl = document.getElementById('result-status-title');
            const descEl = document.getElementById('result-status-desc');
            const actionBtn = document.getElementById('result-action-btn');
            let statusText = "";

            if (score <= 2) {
                titleEl.className = "result-status status-risk";
                titleEl.innerText = "⚠️ Ваш дом находится в зоне повышенного риска";
                descEl.innerText = "Системы жизнеобеспечения дома долго не обслуживались. Любой сильный мороз может привести к аварии. Рекомендуем пройти аудит.";
                actionBtn.innerText = "Записаться на срочный аудит";
                statusText = "Риск поломок";
            } else if (score <= 4) {
                titleEl.className = "result-status status-warn";
                titleEl.innerText = "🟡 Дом обслуживается частично";
                descEl.innerText = "Базовые элементы контроля присутствуют, но есть несколько критических уязвимых точек. Рекомендуется составить календарь ТО.";
                actionBtn.innerText = "Получить рекомендации";
                statusText = "Частичное обслуживание";
            } else {
                titleEl.className = "result-status status-good";
                titleEl.innerText = "🟢 Ваш дом в хорошем состоянии";
                descEl.innerText = "Вы ответственно подходите к эксплуатации. Предлагаем систематизировать данные и перенести их в «Цифровой паспорт дома».";
                actionBtn.innerText = "Узнать подробнее о Паспорте";
                statusText = "Хороший уровень контроля";
            }

            document.getElementById('hidden_quiz_results').value = `Пройден квиз. Набрано баллов: ${score}/${totalSteps}. Вердикт: ${statusText}`;
            progressLabel.innerText = "Тест успешно завершен";
            progressPercent.innerText = "100%";
            progressFill.style.width = "100%";
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
            document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.remove('active');
            currentStep--;
            document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.add('active');
            updateProgressBar();
        }
    });
}

// 4. Валидация и обработка лид-формы (Этап 1 Шаг 2)
function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('username').value;
    const phone = document.getElementById('userphone').value;
    
    // Выбор локации из селекта или поля ручного ввода
    const selectLoc = document.getElementById('location').value;
    const customLocInput = document.getElementById('custom_address');
    const customLoc = customLocInput ? customLocInput.value : '';
    const loc = customLoc ? customLoc : (selectLoc || "Не указан");

    // Сбор выбранных инженерных систем
    const checkedSystems = Array.from(document.querySelectorAll('input[name="audit_systems"]:checked'))
                                .map(cb => cb.value);
    const systemsListText = checkedSystems.length > 0 ? checkedSystems.join(', ') : 'Не выбрано (требуется полный комплекс)';

    const comment = document.getElementById('comment').value;
    const quizResults = document.getElementById('hidden_quiz_results').value;
    const selectedGifts = document.getElementById('hidden_chosen_gifts').value;

    console.log("Пакет данных для отправки заявки на аудит:", { 
        name, 
        phone, 
        location: loc, 
        systems: systemsListText, 
        comment, 
        quizResults,
        selectedGifts
    });

    const formSide = document.querySelector('.form-side');
    formSide.innerHTML = `
        <div style="text-align: center; padding: 40px 10px;">
            <span style="font-size: 50px; display:block; margin-bottom: 20px;">🎉</span>
            <h3 style="color: var(--primary-bg); margin-bottom: 15px;">Заявка на инженерный аудит принята!</h3>
            <p style="font-size: 15px; margin-bottom: 20px; color: #374151; line-height: 1.5;">
                Спасибо, <strong>${name}</strong>! Главный инженер свяжется с вами по номеру <strong>${phone}</strong> в течение 30 минут для согласования времени выезда (локация: <strong>${loc}</strong>).
            </p>
            <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; padding: 12px 15px; border-radius: 6px; font-size: 13px; text-align: left; margin-top: 15px;">
                <strong>Проверяемые системы:</strong> ${systemsListText}<br>
                🎁 <strong>Подарки к выезду:</strong> ${selectedGifts}
            </div>
        </div>
    `;
}

// Функция отслеживания выбранных подарков (для чекбоксов, если используются)
function handleGiftSelection(checkbox) {
    const card = checkbox.closest('.gift-card-select');
    if (checkbox.checked) {
        card.style.borderColor = 'var(--accent-color)';
        card.style.backgroundColor = '#FFF8F0';
    } else {
        card.style.borderColor = '#E2E8F0';
        card.style.backgroundColor = '#FFFFFF';
    }

    const checkboxes = document.querySelectorAll('.gift-checkbox:checked');
    let selectedList = ['Чек-лист ТО'];
    
    checkboxes.forEach(cb => {
        selectedList.push(cb.value);
    });

    document.getElementById('hidden_chosen_gifts').value = selectedList.join(', ');
}
// Логика управления модальным окном Лид-Магнита
function openLeadMagnetModal() {
    const modal = document.getElementById('leadMagnetModal');
    if (modal) modal.style.display = 'flex';
}

function closeLeadMagnetModal() {
    const modal = document.getElementById('leadMagnetModal');
    if (modal) modal.style.display = 'none';
}

// Закрытие модального окна по клику вне его области
window.addEventListener('click', (e) => {
    const modal = document.getElementById('leadMagnetModal');
    if (e.target === modal) {
        closeLeadMagnetModal();
    }
});

// Обработка отправки контактов за лид-магнит
function handleLMSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('lm_name').value;
    const phone = document.getElementById('lm_phone').value;
    const email = document.getElementById('lm_email').value || 'Не указан';

    console.log("Новый лид на скачивание чек-листа:", { name, phone, email, source: "Лид-магнит PDF 25 пунктов" });

    // Имитация мгновенной выдачи файла / скачивания
    const modalContent = document.querySelector('#leadMagnetModal > div');
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 20px 10px;">
            <span style="font-size: 48px; display: block; margin-bottom: 15px;">✅</span>
            <h3 style="color: #111827; margin-bottom: 10px;">Готово, ${name}!</h3>
            <p style="font-size: 14px; color: #4B5563; margin-bottom: 20px;">
                Ваш чек-лист «25 пунктов сезонного обслуживания» подготовлен.
            </p>
           <a href="checklist-domsnab.pdf" download="Чек-лист_ДомСнаб_25_пунктов.pdf" class="btn" style="display: block; width: 100%; text-decoration: none; padding: 12px; font-weight: bold; margin-bottom: 15px;">
    💾 Нажмите для скачивания PDF
</a>
            <button onclick="closeLeadMagnetModal()" style="background: none; border: none; color: #6B7280; font-size: 13px; cursor: pointer; text-decoration: underline;">
                Закрыть окно
            </button>
        </div>
    `;
}
