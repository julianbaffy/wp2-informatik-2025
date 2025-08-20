<script lang="ts">
    let {courseID, courseTeacher, isActive, smallButtons, openTab }= $props()

    let wasActive = $state(isActive);
    let justActivated = $state(false);

$effect(() => {
    if (isActive && !wasActive) {
        justActivated = true;
        setTimeout(() => (justActivated = false), 300); // Dauer der Animation
    }
    wasActive = isActive;
    })

</script>

<button
    onclick={() => openTab(courseID)}
    class="w-full -my-3 flex justify-center text-center items-center transition-all duration-200
    {isActive ? 'active' : 'inactive'} {justActivated ? 'justActivated' : ''} {smallButtons ? 'smallButtons' : ''}"
    >
   <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 100 100"
                stroke-width="10"
                stroke="currentColor"
                class="w-[14px] h-[14px] leftBracket {isActive ? 'slide-out' : 'slide-in'}"
                stroke-linecap="round"
                stroke-linejoin="round"
            >           
                <!-- top-line -->
                <path
                class="top-line-left"
                d="M 0 50 L 100 0"
                />
            
                <!-- bottom-line -->
                <path
                class="bottom-line-left"
                d="M 0 50 L 100 100"
                />
            </svg>
            
            <div class="button-content websites">
                <div class="left-column">
                    <span class="if">IF</span>
                    <span class="teacher">{courseTeacher}</span>
                </div>
                <span class="course-id" data-active={isActive}>{courseID}</span>
            </div>
<svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 100 100"
                stroke-width="10"
                stroke="currentColor"
                class="w-[14px] h-[14px] rightBracket {isActive ? 'slide-out' : 'slide-in'}"
                stroke-linecap="round"
                stroke-linejoin="round"
            >           
                <!-- top-line -->
                <path
                class="top-line-right"
                d="M 0 0 L 100 50"
                />
            
                <!-- bottom-line -->
                <path
                class="bottom-line-right"
                d="M 100 50 L 0 100"
                />
            </svg>

</button>

<style>

@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap');

.button-content{
    margin-left: 8px;
    margin-right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75px;
    gap: 8px;
}

.left-column{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
}

.if{
    font-size: 24px;
    line-height: 1;
}

.teacher{
    font-size: 10;
    line-height: 0.9;
}

.course-id {
  font-size: 51px;
  font-weight: 700;
    display: flex;
    align-items: center;
    line-height: 1;
  opacity: 0.8;
}

button:hover .course-id,
.course-id[data-active="true"] {
  color: var(--color-theme-1);
  opacity: 0.8;
  transition: color 0.3s ease, opacity 0.3s ease;
}

button:hover:not(.active) .course-id{
    color: var(--color-theme-1);
    opacity: 0.7;
    transition: color 0.3s ease, opacity 0.3s ease;
}

button:hover:not(.active) {
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.active{
    opacity: 1;
}

.inactive{
    opacity: 0.7;
}

@keyframes slideLeftOut {
	from { transform: translateX(0);
            opacity: 50%; }
	to   { transform: translateX(-0.625em);
            opacity: 100%; }
}
@keyframes slideLeftIn {
	from { transform: translateX(-0.625em); }
	to   { transform: translateX(0); }
}
@keyframes slideRightOut {
	from { transform: translateX(0); }
	to   { transform: translateX(0.625em); }
}
@keyframes slideRightIn {
	from { transform: translateX(0.625em); }
	to   { transform: translateX(0); }
}

/* ----- Immer zurücksetzen, wenn nichts aktiv ist ----- */
.leftBracket,
.rightBracket {
	transform: translateX(0);
    opacity: 50;
}

/* ----- HOVER: Nur wenn NICHT aktiv ----- */
button:hover:not(.active) .leftBracket {
	animation: slideLeftOut 0.3s ease forwards;
    opacity: 75;
}
button:hover:not(.active) .rightBracket {
	animation: slideRightOut 0.3s ease forwards;
}

/* ----- ACTIVE: Bleibt dauerhaft geslidet ----- */
button.active .leftBracket {
	transform: translateX(-0.625em);
    opacity: 100%;
}
button.active .rightBracket {
	transform: translateX(0.625em);
    opacity: 100%;
    animation: none;
}

/* --- Zurück-Animation bei Mouseleave (wenn NICHT active) --- */
button:not(:hover):not(.active) .leftBracket {
	animation: slideLeftIn 0.2s ease forwards;
}
button:not(:hover):not(.active) .rightBracket {
	animation: slideRightIn 0.2s ease forwards;
}


button.justActivated .leftBracket {
	animation: slideLeftOut 0.3s ease forwards;
}
button.justActivated .rightBracket {
	animation: slideRightOut 0.3s ease forwards;
}

/* small Buttons */

button.smallButtons .button-content {
    width: 60px;
    gap: 4px;
    margin-left: 0px;
    margin-right: 0px;
}


button.smallButtons .teacher {
    display: none;
}

button.smallButtons .course-id {
    font-size: 32px;
}

button.smallButtons .leftBracket,
button.smallButtons .rightBracket {
    width: 10px;
    height: 10px;
}

@media (max-width: 420px) {
  button.smallButtons .leftBracket,
  button.smallButtons .rightBracket {
    display: none;
  }
}


/* animations for small Buttons */

@keyframes slideLeftOutSmall {
	from { transform: translateX(0);
            opacity: 50%; }
	to   { transform: translateX(-0.4em);
            opacity: 100%; }
}
@keyframes slideLeftInSmall {
	from { transform: translateX(-0.3em); }
	to   { transform: translateX(0); }
}
@keyframes slideRightOutSmall {
	from { transform: translateX(0); }
	to   { transform: translateX(0.3em); }
}
@keyframes slideRightInSmall {
	from { transform: translateX(0.3em); }
	to   { transform: translateX(0); }
}

/* Hover bei smallButtons */
button.smallButtons:hover:not(.active) .leftBracket {
    animation: slideLeftOutSmall 0.3s ease forwards;
}
button.smallButtons:hover:not(.active) .rightBracket {
    animation: slideRightOutSmall 0.3s ease forwards;
}

/* Rückanimation */
button.smallButtons:not(:hover):not(.active) .leftBracket {
    animation: slideLeftInSmall 0.2s ease forwards;
}
button.smallButtons:not(:hover):not(.active) .rightBracket {
    animation: slideRightInSmall 0.2s ease forwards;
}

/* Wenn aktiviert (direkt nach Click) */
button.smallButtons.justActivated .leftBracket {
    animation: slideLeftOutSmall 0.3s ease forwards;
}
button.smallButtons.justActivated .rightBracket {
    animation: slideRightOutSmall 0.3s ease forwards;
}

/* Aktiv-Zustand bei smallButtons */
button.smallButtons.active .leftBracket {
	transform: translateX(-0.3em);
}
button.smallButtons.active .rightBracket {
	transform: translateX(0.3em);
}

</style>