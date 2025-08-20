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
            <div class="button-content games">
                <div class="left-column">
                    <span class="if">IF</span>
                    <span class="teacher">{courseTeacher}</span>
                </div>
                <span class="course-id" data-active={isActive}>{courseID}</span>
            </div>
</button>

<style>

.button-content{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75px;
    gap: 8px;
    transform: scale(0.93);
    margin-top: -2.2em;
    margin-bottom: -1.1em;
}

.left-column{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
}

.if{
    font-size: 60px;
    line-height: 0.6;
}

.teacher{
    font-size: 35px;
    line-height: 0.35;
}

.course-id {
  font-size: 115px;
  font-weight: 700;
    display: flex;
    align-items: center;
    line-height: 1;
  opacity: 0.8;
  margin-top: -0.1em;
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

@keyframes scaleUp {
	from { transform: scale(0.93);
            opacity: 70%; }
	to   { transform: scale(1);
            opacity: 100%; }
}
@keyframes scaleDown {
	from { transform: scale(1);
            opacity: 100%; }
	to   { transform: scale(0.93);
            opacity: 70%; }
}

/* ----- HOVER: Nur wenn NICHT aktiv ----- */
button:hover:not(.active) .button-content {
	animation: scaleUp 0.3s ease forwards;
    opacity: 75;
}

/* ----- ACTIVE: Bleibt dauerhaft geslidet ----- */
button.active .button-content {
	transform: scale(1);
    opacity: 100%;
}

/* --- Zurück-Animation bei Mouseleave (wenn NICHT active) --- */
button:not(:hover):not(.active) .button-content {
	animation: scaleDown 0.2s ease forwards;
}


button.justActivated .button-content {
	animation: scaleUp 0.3s ease forwards;
}

/* small Buttons */

button.smallButtons .button-content {
    width: 60px;
    gap: 4px;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: -1.3em;
    margin-bottom: -0.3em;
}


button.smallButtons .teacher {
    display: none;
}

button.smallButtons .course-id {
    font-size: 60px;
    margin-top: 0;
}

</style>