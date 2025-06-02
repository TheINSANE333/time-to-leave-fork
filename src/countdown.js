import { searchLeaveByElement } from '../renderer/notification-channel.js';

let countdownTimer = null;
const timer = null;
export function startCountdownTimer()
{
    if (countdownTimer !== null)
    {
        clearInterval(countdownTimer);
    }
    function updateCountdown()
    {
        const leaveElement = searchLeaveByElement();

        if (!leaveElement)
        {
            const countdownEl = document.getElementById('countdown');
            if (countdownEl)
            {
                countdownEl.innerText = '--:--:--';
            }
            else console.warn('Countdown element not found');
            return;
        }

        const leaveTime = new Date();
        leaveTime.setHours(leaveElement.hour);
        leaveTime.setMinutes(leaveElement.minute);
        leaveTime.setSeconds(0);
        leaveTime.setMilliseconds(0);

        const now = new Date();
        const diffMs = leaveTime - now;

        if (diffMs <= 0)
        {
            // const countdownEl = document.getElementById('countdown');
            clearInterval(countdownTimer);
            clearInterval(timer);
            return;
        }

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const countdownEl = document.getElementById('countdown');
        if (countdownEl)
        {
            countdownEl.innerText =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        else
        {
            console.warn('Countdown element not found');
        }
    }

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
}


document.addEventListener('DOMContentLoaded', function()
{
    function updateCountdown()
    {
        const leaveByElement = document.getElementById('leave-by');
        if (!leaveByElement || !leaveByElement.value || leaveByElement.value === '--:--')
        {
            document.getElementById('countdown').innerText = '--:--:--';
            return;
        }

        const [hours, minutes] = leaveByElement.value.split(':').map(Number);
        const now = new Date();
        const leaveTime = new Date(now);
        leaveTime.setHours(hours, minutes, 0, 0);

        const diffMs = leaveTime - now;

        if (diffMs <= 0)
        {
            document.getElementById('countdown').innerText = '🎉 Time to leave!';
            clearInterval(timer);
            return;
        }

        const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerText =
            `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
    }

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
});