/* ==========================================================================
   MINIMALIST BLACK & WHITE WORKOUT TRACKER - LOGIC & DATA
   ========================================================================== */

// 1. USER'S SPECIFIC WEEKLY PLAN
const weeklyPlan = {
  day1: {
    title: "Chest + Triceps",
    exercises: [
      { name: "Chest Press Machine - صدر مستوي", sets: 4, reps: 12 },
      { name: "Incline Chest Press Machine - صدر علوي", sets: 4, reps: 12 },
      { name: "Chest Fly Machine - صدر عزل", sets: 3, reps: 12 },

      { name: "Tricep Pushdown Machine - ترايسبس", sets: 4, reps: 12 },
      { name: "Overhead Tricep Extension - ترايسبس طويل", sets: 3, reps: 12 },
      { name: "Tricep Extension Machine - ترايسبس عزل", sets: 3, reps: 12 }
    ]
  },

  day2: {
    title: "Back + Shoulders + Biceps",
    exercises: [
      // Back
      { name: "Lat Pulldown - ظهر علوي", sets: 4, reps: 12 },
      { name: "Seated Row Machine - ظهر وسط", sets: 4, reps: 12 },
      { name: "Machine Row - ظهر", sets: 3, reps: 12 },

      // Shoulders
      { name: "Shoulder Press Machine - كتف أمامي", sets: 4, reps: 12 },
      { name: "Lateral Raise Machine - كتف جانبي", sets: 3, reps: 12 },

      // Biceps
      { name: "Dumbbell Curl - بايسبس", sets: 3, reps: 12 },
      { name: "EZ Bar Curl - بايسبس", sets: 3, reps: 12 }
    ]
  },

  day3: {
    title: "Legs + Abs",
    exercises: [
      // Legs
      { name: "Leg Press - أفخاذ", sets: 4, reps: 12 },
      { name: "Leg Extension - أفخاذ أمامية", sets: 4, reps: 12 },
      { name: "Leg Curl - أفخاذ خلفية", sets: 4, reps: 12 },
      { name: "Calf Raise - بطات", sets: 4, reps: 15 },

      // Abs
      { name: "Crunch Machine - بطن", sets: 3, reps: 15 },
      { name: "Plank - بلانك", sets: 3, reps: "30 sec" }
    ]
  },

  day4: {
    title: "Chest + Triceps",
    exercises: [
      { name: "Chest Press Machine - صدر مستوي", sets: 4, reps: 12 },
      { name: "Incline Chest Press Machine - صدر علوي", sets: 4, reps: 12 },
      { name: "Chest Fly Machine - صدر عزل", sets: 3, reps: 12 },

      { name: "Tricep Pushdown Machine - ترايسبس", sets: 4, reps: 12 },
      { name: "Overhead Tricep Extension - ترايسبس طويل", sets: 3, reps: 12 },
      { name: "Tricep Extension Machine - ترايسبس عزل", sets: 3, reps: 12 }
    ]
  },

  day5: {
    title: "Back + Shoulders + Biceps",
    exercises: [
      // Back
      { name: "Lat Pulldown - ظهر علوي", sets: 4, reps: 12 },
      { name: "Seated Row Machine - ظهر وسط", sets: 4, reps: 12 },
      { name: "Machine Row - ظهر", sets: 3, reps: 12 },

      // Shoulders
      { name: "Shoulder Press Machine - كتف أمامي", sets: 4, reps: 12 },
      { name: "Lateral Raise Machine - كتف جانبي", sets: 3, reps: 12 },

      // Biceps
      { name: "Dumbbell Curl - بايسبس", sets: 3, reps: 12 },
      { name: "EZ Bar Curl - بايسبس", sets: 3, reps: 12 }
    ]
  },

  day6: {
    title: "Cardio + Forearms",
    exercises: [
      // Forearms
      { name: "Wrist Curl - سواعد", sets: 4, reps: 15 },
      { name: "Reverse Wrist Curl - سواعد عكسي", sets: 4, reps: 15 },

      // Cardio
      {
        name: "Elliptical / Treadmill",
        duration: "35-45 min",
        speed: "5.5",
        incline: "4"
      }
    ]
  },

  day7: {
    title: "Cardio",
    exercises: [
      {
        name: "Elliptical / Treadmill",
        duration: "35-45 min",
        speed: "5.5",
        incline: "4"
      }
    ]
  }
};

const dayMetadata = {
  day1: { name: "الأحد", focus: "صدر + ترايسبس" },
  day2: { name: "الاثنين", focus: "ظهر + أكتاف + بايسبس" },
  day3: { name: "الثلاثاء", focus: "أرجل + بطن" },
  day4: { name: "الأربعاء", focus: "صدر + ترايسبس" },
  day5: { name: "الخميس", focus: "ظهر + أكتاف + بايسبس" },
  day6: { name: "الجمعة", focus: "كارديو + سواعد" },
  day7: { name: "السبت", focus: "كارديو" }
};

// 2. STATE VARIABLES
const dayIds = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];
let activeDayId = 'day1';
let notificationsEnabled = false;

// 3. INITIALIZATION
function initApp() {
    setupDefaultDayStates();
    setSelectedDayToCurrent();
    renderDaysGrid();
    renderActiveDay();
    setupEventListeners();
    checkNotificationStatus();
    checkScheduledReminder();
}

const CURRENT_PLAN_VERSION = 'v10_updated_plan';

// Make sure every day has a state saved in localStorage.
// Uses user's required naming convention: 'workout-data-day1', 'workout-data-day2', etc.
function setupDefaultDayStates() {
    // Version check to automatically upgrade user's cached plan when changed
    const savedVersion = localStorage.getItem('workout_plan_version');
    if (savedVersion !== CURRENT_PLAN_VERSION) {
        dayIds.forEach(dayId => {
            localStorage.removeItem(`workout-data-${dayId}`);
        });
        localStorage.setItem('workout_plan_version', CURRENT_PLAN_VERSION);
    }

    dayIds.forEach(dayId => {
        const key = `workout-data-${dayId}`;
        const savedData = localStorage.getItem(key);
        
        if (!savedData) {
            // Seed from default weeklyPlan
            const defaultDay = weeklyPlan[dayId];
            const exercises = [];
            
            // 1. Add strength/normal exercises
            if (defaultDay.exercises && defaultDay.exercises.length > 0) {
                defaultDay.exercises.forEach((ex, idx) => {
                    exercises.push({
                        id: `${dayId}_ex_${idx}_${Date.now()}`,
                        name: ex.name,
                        sets: ex.sets || null,
                        reps: ex.reps || null,
                        duration: ex.duration || null,
                        incline: ex.incline !== undefined ? ex.incline : null,
                        intensity: ex.intensity || null,
                        targetWeight: ex.weight || null,
                        actualWeight: "",
                        completed: false,
                        image: ex.image || ""
                    });
                });
            }
            
            // 2. Add cardio exercises if defined in cardio object
            if (defaultDay.cardio) {
                let cardIdx = exercises.length;
                if (defaultDay.cardio.elliptical) {
                    exercises.push({
                        id: `${dayId}_ex_${cardIdx++}_${Date.now()}`,
                        name: "Elliptical (أوبتكال) - كارديو",
                        sets: null,
                        reps: null,
                        duration: defaultDay.cardio.elliptical,
                        incline: null,
                        intensity: null,
                        targetWeight: null,
                        actualWeight: "",
                        completed: false,
                        image: ""
                    });
                }
                if (defaultDay.cardio.treadmill) {
                    exercises.push({
                        id: `${dayId}_ex_${cardIdx++}_${Date.now()}`,
                        name: "Treadmill (جهاز الجري) - كارديو",
                        sets: null,
                        reps: null,
                        duration: defaultDay.cardio.treadmill,
                        incline: null,
                        intensity: null,
                        targetWeight: null,
                        actualWeight: "",
                        completed: false,
                        image: ""
                    });
                }
            }
            
            const initializedDay = {
                title: defaultDay.title,
                exercises: exercises
            };
            localStorage.setItem(key, JSON.stringify(initializedDay));
        }
    });

    // Notification State
    notificationsEnabled = localStorage.getItem('workout_tracker_notifications') === 'true';
}

// Automatically select today's day card on load
function setSelectedDayToCurrent() {
    const jsDay = new Date().getDay(); // 0 is Sun, 1 is Mon...
    // Map JS days to our plan days:
    // day1: Sunday (0), day2: Monday (1), day3: Tuesday (2), day4: Wednesday (3), day5: Thursday (4), day6: Friday (5), day7: Saturday (6)
    const dayMapping = {
        0: 'day1', // Sunday
        1: 'day2', // Monday
        2: 'day3', // Tuesday
        3: 'day4', // Wednesday
        4: 'day5', // Thursday
        5: 'day6', // Friday
        6: 'day7'  // Saturday
    };
    
    activeDayId = dayMapping[jsDay] || 'day1';
}

// Get loaded object state for a single day
function getDayData(dayId) {
    const key = `workout-data-${dayId}`;
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        console.error(`Error loading state for key ${key}`, e);
        return null;
    }
}

// Save active state for a single day
function saveDayData(dayId, data) {
    const key = `workout-data-${dayId}`;
    localStorage.setItem(key, JSON.stringify(data));
}

// 4. RENDERING FUNCTIONS

// Render Day Tabs Navigation Grid
function renderDaysGrid() {
    const gridContainer = document.getElementById('days-grid');
    gridContainer.innerHTML = '';

    dayIds.forEach(dayId => {
        const data = getDayData(dayId);
        const meta = dayMetadata[dayId];
        
        if (!data || !meta) return;

        const totalEx = data.exercises.length;
        const completedEx = data.exercises.filter(ex => ex.completed).length;
        const isCompleted = totalEx > 0 && completedEx === totalEx;
        const isActive = dayId === activeDayId;

        const dayCard = document.createElement('button');
        dayCard.className = `day-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        dayCard.setAttribute('data-id', dayId);
        
        dayCard.innerHTML = `
            <span class="day-name">${meta.name}</span>
            <span class="day-workout-type">${data.title}</span>
            <span class="day-status-dot"></span>
        `;
        
        dayCard.addEventListener('click', () => {
            activeDayId = dayId;
            renderDaysGrid();
            renderActiveDay();
        });
        
        gridContainer.appendChild(dayCard);
    });
}

// Helper to map exercise names to beautiful live Unsplash gym photos
function getExerciseImage(name, localImage) {
    // If the image is already a full URL, use it
    if (localImage && (localImage.startsWith('http://') || localImage.startsWith('https://'))) {
        return localImage;
    }

    const term = name.toLowerCase();

    // Map keywords to high-quality, dark-themed Unsplash fitness photos
    if (term.includes('treadmill') || term.includes('cardio') || term.includes('bike') || term.includes('walking')) {
        return 'https://images.unsplash.com/photo-1578762560072-4a332a5b1d98?auto=format&fit=crop&w=300&q=80'; // Treadmill/Cardio/Bike/Walking
    }
    if (term.includes('bench press') || term.includes('chest press') || term.includes('dumbbell chest') || term.includes('incline dumbbell') || term.includes('pec deck')) {
        return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=300&q=80'; // Chest Press/Fly/Pec Deck
    }
    if (term.includes('cable chest') || term.includes('flys') || term.includes('dips')) {
        return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=300&q=80'; // Chest Fly/Dips
    }
    if (term.includes('lat pulldown') || term.includes('seated cable row') || term.includes('barbell row') || term.includes('row')) {
        return 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=300&q=80'; // Back pulldowns/rows
    }
    if (term.includes('face pull') || term.includes('pull-up') || term.includes('chin-up')) {
        return 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=300&q=80'; // Back / Facepulls
    }
    if (term.includes('leg press') || term.includes('squat')) {
        return 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=300&q=80'; // Leg Press/Squat
    }
    if (term.includes('leg extension') || term.includes('leg curl') || term.includes('calf raise')) {
        return 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=300&q=80'; // Leg curls/extensions
    }
    if (term.includes('bicep') || term.includes('hammer curl') || term.includes('curl')) {
        return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80'; // Arm Curls
    }
    if (term.includes('tricep') || term.includes('pushdown') || term.includes('extension')) {
        return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80'; // Arm Extensions/Pushdowns
    }
    if (term.includes('shoulder') || term.includes('lateral raise') || term.includes('front raise') || term.includes('rear delt')) {
        return 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=300&q=80'; // Shoulders
    }
    if (term.includes('plank') || term.includes('leg raise') || term.includes('twist') || term.includes('crunch') || term.includes('abs') || term.includes('dead bug') || term.includes('bird-dog') || term.includes('chair') || term.includes('knee raise') || term.includes('torso') || term.includes('rotation') || term.includes('woodchopper')) {
        return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80'; // Abs/Plank/Dead Bug/Bird Dog/Captain's Chair/Torso Rotation
    }
    if (term.includes('stretch') || term.includes('mobility')) {
        return 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=300&q=80'; // Yoga/Mobility
    }

    // Default fitness image fallback
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80';
}

// Render active day's workouts, statistics and inputs
function renderActiveDay() {
    const data = getDayData(activeDayId);
    const meta = dayMetadata[activeDayId];

    if (!data || !meta) return;

    // Header Info
    document.getElementById('current-day-name').textContent = `${meta.name} - ${data.title}`;
    document.getElementById('current-day-focus').textContent = meta.focus;

    // Exercises List
    const listContainer = document.getElementById('exercises-list');
    listContainer.innerHTML = '';

    if (data.exercises.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-dumbbell"></i>
                <p>لا توجد تمارين مضافة لهذا اليوم.</p>
            </div>
        `;
        updateProgress();
        return;
    }

    data.exercises.forEach(ex => {
        const itemEl = document.createElement('div');
        itemEl.className = `exercise-item ${ex.completed ? 'completed' : ''}`;
        
        // Meta description (Cardio duration/incline or Strength sets/reps + target weight)
        let metaText = '';
        if (ex.duration) {
            metaText = `المدة: ${ex.duration}`;
            if (ex.incline !== null) metaText += ` | ميل: ${ex.incline}%`;
        } else {
            metaText = `${ex.sets} جولات × ${ex.reps} تكرار`;
            if (ex.targetWeight) metaText += ` (مستهدف: ${ex.targetWeight})`;
        }

        const imageSrc = getExerciseImage(ex.name, ex.image);

        itemEl.innerHTML = `
            <div class="exercise-main-row">
                <div class="exercise-check-wrapper">
                    <label class="custom-checkbox">
                        <input type="checkbox" class="exercise-checkbox" data-id="${ex.id}" ${ex.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <span class="exercise-name">${ex.name}</span>
                </div>
                
                <div class="exercise-actions">
                    <div class="input-group" onclick="event.stopPropagation()">
                        <input type="text" class="weight-input" data-id="${ex.id}" placeholder="الوزن" value="${ex.actualWeight || ''}">
                        <span class="input-unit">فعلي</span>
                    </div>
                    <button class="delete-exercise-btn" data-id="${ex.id}" title="حذف التمرين" onclick="event.stopPropagation()"><i class="fa-regular fa-trash-can"></i></button>
                    <span class="accordion-toggle-icon"><i class="fa-solid fa-chevron-down"></i></span>
                </div>
            </div>
            
            <div class="exercise-details-panel">
                <div class="details-panel-grid">
                    <div class="details-text-col">
                        <div class="detail-meta-item"><strong>الجولات (Sets):</strong> <span>${ex.sets || '-'}</span></div>
                        <div class="detail-meta-item"><strong>التكرارات (Reps):</strong> <span>${ex.reps || '-'}</span></div>
                        ${ex.targetWeight ? `<div class="detail-meta-item"><strong>الوزن المستهدف:</strong> <span>${ex.targetWeight}</span></div>` : ''}
                        ${ex.duration ? `<div class="detail-meta-item"><strong>المدة (Duration):</strong> <span>${ex.duration}</span></div>` : ''}
                        ${ex.incline !== null && ex.incline !== undefined ? `<div class="detail-meta-item"><strong>الميل (Incline):</strong> <span>${ex.incline}%</span></div>` : ''}
                        ${ex.intensity ? `<div class="detail-meta-item"><strong>الشّدّة (Intensity):</strong> <span>${ex.intensity === 'Low' ? 'منخفضة' : ex.intensity}</span></div>` : ''}
                        
                        <a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(ex.name + ' gym exercise machine')}" 
                           target="_blank" class="google-search-link" onclick="event.stopPropagation()">
                            <i class="fa-solid fa-magnifying-glass"></i> ابحث عن صور الجهاز على Google
                        </a>
                    </div>
                    <div class="details-image-col">
                        <div class="exercise-img-box">
                            <img class="exercise-img" src="${imageSrc}" alt="${ex.name}" onerror="handleImageError(this)">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        listContainer.appendChild(itemEl);
    });

    setupExerciseInteractivity();
    updateProgress();
}

// Fallback for missing exercise images
function handleImageError(img) {
    img.style.display = 'none';
    const container = img.parentElement;
    container.innerHTML = `<i class="fa-solid fa-dumbbell exercise-img-fallback"></i>`;
}

// Setup Event Listeners for Checked Status & Weight Inputs
function setupExerciseInteractivity() {
    const data = getDayData(activeDayId);
    if (!data) return;

    // Checkbox Change
    document.querySelectorAll('.exercise-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const exId = e.target.getAttribute('data-id');
            const exercise = data.exercises.find(ex => ex.id === exId);
            
            if (exercise) {
                exercise.completed = e.target.checked;
                saveDayData(activeDayId, data);
                
                const item = e.target.closest('.exercise-item');
                if (exercise.completed) {
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }
                
                updateProgress();
                renderDaysGrid();
            }
        });
    });

    // Weight Input Change (Saves immediately on keypress)
    document.querySelectorAll('.weight-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const exId = e.target.getAttribute('data-id');
            const exercise = data.exercises.find(ex => ex.id === exId);
            
            if (exercise) {
                exercise.actualWeight = e.target.value;
                saveDayData(activeDayId, data);
            }
        });
    });

    // Delete Button
    document.querySelectorAll('.delete-exercise-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const exId = e.currentTarget.getAttribute('data-id');
            const item = e.currentTarget.closest('.exercise-item');
            
            // Delete transition
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                data.exercises = data.exercises.filter(ex => ex.id !== exId);
                saveDayData(activeDayId, data);
                renderActiveDay();
                renderDaysGrid();
                showToast("تم حذف التمرين من اليوم");
            }, 200);
        });
    });

    // Accordion Toggle
    document.querySelectorAll('.exercise-main-row').forEach(row => {
        row.addEventListener('click', (e) => {
            // Prevent toggling if checking checkbox or clicking delete/inputs
            if (e.target.closest('.custom-checkbox') || e.target.closest('.exercise-actions button') || e.target.closest('.input-group')) {
                return;
            }

            const item = e.currentTarget.closest('.exercise-item');
            const panel = item.querySelector('.exercise-details-panel');
            const isExpanded = item.classList.contains('expanded');

            if (isExpanded) {
                item.classList.remove('expanded');
                panel.style.maxHeight = null;
            } else {
                // Collapse any other expanded elements
                document.querySelectorAll('.exercise-item.expanded').forEach(expandedItem => {
                    expandedItem.classList.remove('expanded');
                    expandedItem.querySelector('.exercise-details-panel').style.maxHeight = null;
                });

                item.classList.add('expanded');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
}

// 5. PROGRESS CALCULATION
function updateProgress() {
    const currentData = getDayData(activeDayId);
    if (!currentData) return;

    // Active Day Progress (Circular Chart)
    const dayTotal = currentData.exercises.length;
    const dayCompleted = currentData.exercises.filter(ex => ex.completed).length;
    const dayPercentage = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;

    document.getElementById('day-percentage-text').textContent = `${dayCompleted}/${dayTotal} مكتمل`;
    
    const progressCircle = document.getElementById('day-progress-circle');
    progressCircle.setAttribute('stroke-dasharray', `${dayPercentage}, 100`);

    // Global Week Progress
    let totalExercises = 0;
    let completedExercises = 0;

    dayIds.forEach(dayId => {
        const data = getDayData(dayId);
        if (data) {
            totalExercises += data.exercises.length;
            completedExercises += data.exercises.filter(ex => ex.completed).length;
        }
    });

    const weeklyPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    
    document.getElementById('weekly-percentage-text').textContent = `${weeklyPercentage}%`;
    document.getElementById('weekly-progress-fill').style.width = `${weeklyPercentage}%`;
}

// 6. POPUPS & SETTINGS MENU
function setupEventListeners() {
    // Dropdown Actions Toggle
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
    });

    // Reset All Factory Settings
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("هل أنت متأكد من رغبتك في حذف كل السجلات والتمارين المخصصة والرجوع للبرنامج الافتراضي؟")) {
            dayIds.forEach(dayId => {
                localStorage.removeItem(`workout-data-${dayId}`);
            });
            setupDefaultDayStates();
            renderDaysGrid();
            renderActiveDay();
            showToast("تمت إعادة تهيئة التطبيق بنجاح");
        }
    });

    // Add Exercise Modal Window Control
    const modal = document.getElementById('add-exercise-modal');
    const showModalBtn = document.getElementById('show-add-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    
    showModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.getElementById('new-exercise-name').focus();
    });
    
    const closeModal = () => {
        modal.classList.add('hidden');
        document.getElementById('add-exercise-form').reset();
    };

    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    // Save Custom Exercise Form
    document.getElementById('add-exercise-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('new-exercise-name').value.trim();
        const sets = parseInt(document.getElementById('new-exercise-sets').value) || 3;
        const reps = document.getElementById('new-exercise-reps').value.trim() || "12";
        
        if (name) {
            const data = getDayData(activeDayId);
            if (data) {
                const newEx = {
                    id: `${activeDayId}_ex_${Date.now()}`,
                    name: name,
                    sets: sets,
                    reps: reps,
                    duration: null,
                    incline: null,
                    targetWeight: "BW",
                    actualWeight: "",
                    completed: false,
                    image: ""
                };
                
                data.exercises.push(newEx);
                saveDayData(activeDayId, data);
                closeModal();
                renderActiveDay();
                renderDaysGrid();
                showToast("تمت إضافة التمرين بنجاح");
            }
        }
    });

    // Export Buttons
    document.getElementById('export-json-btn').addEventListener('click', exportToJSON);
    document.getElementById('export-csv-btn').addEventListener('click', exportToCSV);

    // Import Trigger
    const fileInput = document.getElementById('import-file-input');
    document.getElementById('import-btn-trigger').addEventListener('click', () => {
        fileInput.click();
    });
    fileInput.addEventListener('change', importFromJSON);

    // Notification Enable Button
    document.getElementById('notification-btn').addEventListener('click', toggleNotifications);
}

// 7. EXPORT AND IMPORT LOGIC

// Export to JSON
function exportToJSON() {
    const exportObject = {};
    dayIds.forEach(dayId => {
        exportObject[dayId] = getDayData(dayId);
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `workout_tracker_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast("تم تصدير ملف النسخة الاحتياطية (JSON)");
}

// Export to CSV (Includes BOM for Arabic font formatting in Microsoft Excel)
function exportToCSV() {
    let csv = "\ufeff"; // BOM
    csv += "اليوم,نوع التمرين,مستهدف اليوم,اسم التمرين,الجولات,التكرارات,المدة,الميل,الشّدّة,مستهدف الوزن,الوزن الفعلي,مكتمل\n";
    
    dayIds.forEach(dayId => {
        const data = getDayData(dayId);
        const meta = dayMetadata[dayId];
        if (data && meta) {
            data.exercises.forEach(ex => {
                const cleanName = ex.name.replace(/,/g, " - ");
                const cleanFocus = meta.focus.replace(/,/g, " - ");
                const row = [
                    meta.name,
                    data.title,
                    cleanFocus,
                    cleanName,
                    ex.sets || "-",
                    ex.reps || "-",
                    ex.duration || "-",
                    ex.incline !== null ? ex.incline : "-",
                    ex.intensity || "-",
                    ex.targetWeight || "-",
                    ex.actualWeight || "-",
                    ex.completed ? "نعم" : "لا"
                ].join(",");
                csv += row + "\n";
            });
        }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", url);
    dlAnchor.setAttribute("download", `workout_tracker_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast("تم تصدير تقرير التمارين (CSV)");
}

// Import JSON Backup file
function importFromJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const imported = JSON.parse(event.target.result);
            
            // Validate backup shape (must contain keys day1 to day7)
            const isValid = dayIds.every(dayId => {
                return imported[dayId] && Array.isArray(imported[dayId].exercises);
            });

            if (isValid) {
                dayIds.forEach(dayId => {
                    saveDayData(dayId, imported[dayId]);
                });
                renderDaysGrid();
                renderActiveDay();
                showToast("تم استيراد نسخة التتبع بنجاح!");
            } else {
                throw new Error("صيغة الملف غير متوافقة");
            }
        } catch (error) {
            alert("خطأ: تعذر استيراد الملف. تأكد من أن الملف هو ملف JSON تم تصديره من هذا التطبيق سابقاً.");
            console.error(error);
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Clear input value
}

// 8. TOAST MESSAGES
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}

// 9. BROWSER NOTIFICATION SYSTEM
function checkNotificationStatus() {
    const notifBtn = document.getElementById('notification-btn');
    if (notificationsEnabled && Notification.permission === 'granted') {
        notifBtn.classList.add('active');
        notifBtn.querySelector('i').className = 'fa-solid fa-bell';
    } else {
        notifBtn.classList.remove('active');
        notifBtn.querySelector('i').className = 'fa-regular fa-bell';
        notificationsEnabled = false;
        localStorage.setItem('workout_tracker_notifications', 'false');
    }
}

function toggleNotifications() {
    if (notificationsEnabled) {
        notificationsEnabled = false;
        localStorage.setItem('workout_tracker_notifications', 'false');
        checkNotificationStatus();
        showToast("تم إلغاء تفعيل التنبيهات");
    } else {
        if (!("Notification" in window)) {
            alert("عذراً، هذا المتصفح لا يدعم نظام التنبيهات.");
            return;
        }

        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                notificationsEnabled = true;
                localStorage.setItem('workout_tracker_notifications', 'true');
                checkNotificationStatus();
                showToast("تم تفعيل التنبيهات اليومية بنجاح!");
                
                new Notification("مرحباً بك في AESTHETIC FIT ⚡", {
                    body: "لقد تم تفعيل تنبيهات التمارين بنجاح. حافظ على استمرارية تدريبك!",
                    icon: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/dumbbell.svg"
                });
            } else {
                showToast("تم رفض إذن التنبيهات من المتصفح");
            }
        });
    }
}

// Smart Reminder check: Triggers daily reminder if user has 0% completed after 5 PM
function checkScheduledReminder() {
    if (!notificationsEnabled || Notification.permission !== 'granted') return;

    const data = getDayData(activeDayId);
    const meta = dayMetadata[activeDayId];
    if (!data || !meta) return;

    const completedCount = data.exercises.filter(ex => ex.completed).length;
    const currentHour = new Date().getHours();

    // Trigger reminder if no exercises logged and it's evening
    if (completedCount === 0 && currentHour >= 17) {
        setTimeout(() => {
            new Notification("تذكير التمرين اليومي ⚡", {
                body: `لم تسجل أي تقدم اليوم في تمرين: ${data.title} (${meta.focus}). لا تنسى إتمام جلستك!`,
                tag: 'workout-reminder-daily'
            });
        }, 2000);
    }
}

// Window Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
