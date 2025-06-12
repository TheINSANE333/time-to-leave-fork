import { searchLeaveByElement } from '../renderer/notification-channel.js';

// Timer variable for the countdown interval
let countdownTimer = null;
const timer = null;
export function startCountdownTimer()
{
    // If timer is already running, stop it first
    if (countdownTimer !== null)
    {
        clearInterval(countdownTimer);
    }
    // Function to update the countdown every second
    function updateCountdown()
    {
        // Get the leave time
        const leaveByValue = searchLeaveByElement();

        // If leave time is not set, show default countdown
        if (!leaveByValue || leaveByValue === '--:--')
        {
            if (typeof document !== 'undefined')
            {
                const countdownEl = document.getElementById('countdown');
                if (countdownEl)
                {
                    countdownEl.innerText = '--:--:--';
                }
                else
                {
                    console.warn('Countdown element not found');
                }
            }
            return;
        }

        // Parse hours and minutes from the input
        const [hours, minutes] = leaveByValue.split(':').map(Number);
        
        // Set up the leave time using the hour and minute
        const leaveTime = new Date();
        leaveTime.setHours(hours);
        leaveTime.setMinutes(minutes);
        leaveTime.setSeconds(0);
        leaveTime.setMilliseconds(0);

        // Get the current time
        const now = new Date();
        // Calculate the difference in milliseconds
        const diffMs = leaveTime - now;

        // If time is up, stop the timer
        if (diffMs <= 0)
        {
            clearInterval(countdownTimer);
            clearInterval(timer);
            return;
        }

        // Calculate hours, minutes, seconds left
        const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

        // Update the countdown element in the DOM
        if (typeof document !== 'undefined')
        {
            const countdownEl = document.getElementById('countdown');
            if (countdownEl)
            {
                countdownEl.innerText =
                    `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
            }
            else
            {
                console.warn('Countdown element not found');
            }
        }
    }

    updateCountdown();
    // Then keep running every second
    countdownTimer = setInterval(updateCountdown, 1000);
}

if (typeof document !== 'undefined')
{
    document.addEventListener('DOMContentLoaded', function()
    {
        function updateCountdown()
        {
            const leaveByElement = document.getElementById('leave-by');
            // If no time is set, show default
            if (!leaveByElement || !leaveByElement.value || leaveByElement.value === '--:--')
            {
                document.getElementById('countdown').innerText = '--:--:--';
                return;
            }

            // Parse hours and minutes from the input
            const [hours, minutes] = leaveByElement.value.split(':').map(Number);
            const now = new Date();
            const leaveTime = new Date(now);
            leaveTime.setHours(hours, minutes, 0, 0);

            // Calculate time left
            const diffMs = leaveTime - now;

            // If time is up, show message and stop timer
            if (diffMs <= 0)
            {
                document.getElementById('countdown').innerText = '🎉 Time to leave!';
                clearInterval(timer);
                return;
            }

            // Calculate hours, minutes, seconds left
            const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

            // Update the countdown display
            document.getElementById('countdown').innerText =
                `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        }

        // Start the timer for the input-based countdown
        const timer = setInterval(updateCountdown, 1000);
        updateCountdown();
    });
}
