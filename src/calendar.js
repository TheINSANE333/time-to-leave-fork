'use strict';

import { CalendarFactory } from '../renderer/classes/CalendarFactory.js';
import { applyTheme } from '../renderer/themes.js';
import { searchLeaveByElement } from '../renderer/notification-channel.js';
import { startCountdownTimer } from './countdown.js';


// contextBridge.exposeInMainWorld('calendarApi', calendarApi);


// Global values for calendar
let calendar = undefined;

function setupTimeFormatButton()
{
    // Check if running in a browser/Electron renderer environment
    if (typeof document === 'undefined') return;

    const timeFormatButton = document.getElementById('time-format');

    // Ensure the element actually exists
    if (!timeFormatButton) return;

    timeFormatButton.addEventListener('click', () =>
    {
        // Use the calendarApi you already have
        calendarApi.sendRestartApp();
    });
}

function setupThemeToggle(preferences)
{
    // Get the theme toggle element
    const themeToggle = document.getElementById('theme-toggle');
    // Get the checkbox element inside the toggle
    const themeCheckbox = themeToggle.querySelector('input[type="checkbox"]');

    // Determine the initial theme
    // If set to 'system-default', use the current system preference (light or dark)
    // Else, use the saved user preference
    const initTheme = preferences.theme === 'system-default'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : preferences.theme;

    //Set initial state of the checkbox
    themeCheckbox.checked = initTheme === 'dark';
    themeToggle.classList.toggle('dark-mode', initTheme === 'dark');

    themeToggle.addEventListener('change', (event) =>
    {
        // Get the new theme based on checkbox state
        const newTheme = event.target.checked ? 'dark' : 'light';

        // Update preferences
        preferences.theme = newTheme;

        // Apply new theme
        applyTheme(newTheme);
        // Update appearance by toggling dark mode class
        themeToggle.classList.toggle('dark-mode', newTheme === 'dark');

        // Save preferences
        window.rendererApi.savePreferences(preferences);
    });
}

function setupCalendar(preferences)
{
    window.rendererApi.getLanguageDataPromise().then(async languageData =>
    {
        calendar = await CalendarFactory.getInstance(preferences, languageData, calendar);
        applyTheme(preferences.theme);
        setupThemeToggle(preferences);
    });
}

function setupIpcHandlers()
{
    // Reload the calendar upon request from main
    window.calendarApi.handleCalendarReload(async() =>
    {
        await calendar.reload();
    });

    // Update the calendar after a day has passed
    window.calendarApi.handleRefreshOnDayChange((event, oldDate, oldMonth, oldYear) =>
    {
        calendar.refreshOnDayChange(oldDate, oldMonth, oldYear);
    });

    // Get notified when preferences has been updated.
    window.calendarApi.handlePreferencesSaved((event, prefs) =>
    {
        setupCalendar(prefs);
    });

    // Get notified when waivers get updated.
    window.calendarApi.handleWaiverSaved(async() =>
    {
        await calendar.loadInternalWaiveStore();
        calendar.redraw();
    });

    // Punch the date and time as requested by user.
    window.calendarApi.handlePunchDate(() =>
    {
        calendar.punchDate();
        startCountdownTimer();
    });

    // Reload theme.
    window.calendarApi.handleThemeChange(async(event, theme) =>
    {
        applyTheme(theme);
    });

    // Returns value of "leave by" for notifications.
    window.calendarApi.handleLeaveBy(searchLeaveByElement);

    // Change the main window style to indicate an operation is processing.
    window.calendarApi.handleToggleMainWindowWait((event, enable) =>
    {
        const waitClass = 'wait';
        if (enable)
        {
            if (!$('html').hasClass(waitClass))
            {
                $('html').addClass(waitClass);
            }
        }
        else
        {
            $('html').removeClass(waitClass);
        }
    });
}

// On page load, create the calendar and setup notification
$(() =>
{
    const preferences = window.rendererApi.getOriginalUserPreferences();
    requestAnimationFrame(() =>
    {
        setupCalendar(preferences);
        setupTimeFormatButton();
        requestAnimationFrame(() =>
        {
            setTimeout(() =>
            {
                window.rendererApi.notifyWindowReadyToShow();
            }, 100);
        });
    });
    setupIpcHandlers();
    startCountdownTimer();
});
