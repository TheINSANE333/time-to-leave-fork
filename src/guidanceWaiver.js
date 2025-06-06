$(document).ready(() =>
{
    const steps = [
        {
            element: '.header-title',
            title: 'Welcome to Workday Waiver Manager',
            description: 'This tool helps you manage workday waivers and holidays. Changes take effect when you close this window.',
            action: 'ensure-add-waiver-tab'
        },
        {
            element: '.nav-tabs',
            title: 'Navigation Tabs',
            description: 'Switch between "Add Waiver" to create new waivers and "Holiday" to import holiday dates.',
            action: 'ensure-add-waiver-tab'
        },
        {
            element: '#add-waiver-tab',
            title: 'Add Waiver Tab',
            description: 'Currently on the Add Waiver tab. Here you can manually add workday waivers for specific date ranges.',
            action: 'ensure-add-waiver-tab'
        },
        {
            element: '#start-date',
            title: 'Start Date',
            description: 'Select the beginning date for your waiver period. You can waive single days or date ranges.',
            action: 'ensure-add-waiver-tab'
        },
        {
            element: '#end-date',
            title: 'End Date',
            description: 'Select the ending date for your waiver period. For single-day waivers, use the same date as start date.',
            action: 'ensure-add-waiver-tab'
        },
        {
            element: '#hours',
            title: 'Hours Field',
            description: 'The working hour per day set in preference settings. This determines how many hours are waived per day.',
            action: 'ensure-add-waiver-tab'
        },
        {
            element: '#reason',
            title: 'Waiver Reason',
            description: 'Provide a reason for the waiver (optional, up to 30 characters). This helps track why the waiver was created.',
            action: 'ensure-add-waiver-tab'
        },
        {
            element: '#waive-button',
            title: 'Waive Button',
            description: 'Click this button to create the waiver with your specified settings. Now let\'s explore the Holiday tab!',
            action: 'ensure-add-waiver-tab'
        },
        // Holiday Section (Steps 9-14) - Auto-switch to Holiday tab
        {
            element: '#holiday-tab',
            title: 'Holiday Tab',
            description: 'Now switching to the Holiday tab to show you how to import public holidays as waivers.',
            action: 'switch-to-holiday-tab'
        },
        {
            element: '#year',
            title: 'Select Year',
            description: 'Choose the year for which you want to import holidays.',
            action: 'ensure-holiday-tab'
        },
        {
            element: '#country',
            title: 'Select Country',
            description: 'Choose your country to get the appropriate public holidays.',
            action: 'ensure-holiday-tab'
        },
        {
            element: '#state',
            title: 'Select State/Province',
            description: 'Select your state or province for region-specific holidays (if applicable).',
            action: 'ensure-holiday-tab'
        },
        {
            element: '#holiday-list-table',
            title: 'Holiday List',
            description: 'Review the available holidays. Check the "Import?" column for holidays you want to add as waivers.',
            action: 'ensure-holiday-tab'
        },
        {
            element: '#holiday-button',
            title: 'Source Holidays',
            description: 'Click to import selected holidays as waivers. Note: This will override any existing waivers on those dates.',
            action: 'ensure-holiday-tab'
        },
        // Final step - Back to main view
        {
            element: '#waiver-list-table',
            title: 'Waived Workday List',
            description: 'This table shows all your current waivers. You can see the date, reason, and hours waived for each entry. Tour complete!',
            action: 'switch-to-add-waiver-tab'
        }
    ];

    let currentStep = 0;

    function executeStepAction(action)
    {
        switch (action)
        {
        case 'ensure-add-waiver-tab':
            // Make sure we're on the Add Waiver tab
            if (!$('#add-waiver-tab').hasClass('active'))
            {
                $('#add-waiver-tab').tab('show');
                // Alternative if using Bootstrap: $('#add-waiver-tab').click();
            }
            break;
        case 'switch-to-holiday-tab':
            // Switch to Holiday tab
            $('#holiday-tab').tab('show');
            // Alternative if using Bootstrap: $('#holiday-tab').click();
            break;
        case 'ensure-holiday-tab':
            // Make sure we're on the Holiday tab
            if (!$('#holiday-tab').hasClass('active'))
            {
                $('#holiday-tab').tab('show');
                // Alternative if using Bootstrap: $('#holiday-tab').click();
            }
            break;
        case 'switch-to-add-waiver-tab':
            // Switch back to Add Waiver tab
            $('#add-waiver-tab').tab('show');
            // Alternative if using Bootstrap: $('#add-waiver-tab').click();
            break;
        }
    }

    function createOverlay()
    {
        return $('<div>').addClass('driver-overlay').appendTo('body');
    }

    function createPopover(step)
    {
        const $popover = $('<div>').addClass('driver-popover').html(`
            <h4>${step.title}</h4>
            <p>${step.description}</p>
            <div>
                <button class="driver-btn prev" ${currentStep === 0 ? 'disabled' : ''}>Previous</button>
                <button class="driver-btn next">${currentStep === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
        `);

        const $element = $(step.element);
        if ($element.length === 0)
        {
            console.warn(`Element ${step.element} not found`);
            return $popover;
        }

        const rect = $element[0].getBoundingClientRect();

        $popover.css({
            position: 'absolute',
            top: rect.bottom + window.scrollY + 10,
            left: rect.left + window.scrollX,
            zIndex: 10001
        });

        return $popover;
    }

    function cleanup()
    {
        $('.driver-overlay').remove();
        $('.driver-popover').remove();
        $('.driver-highlight').removeClass('driver-highlight');
        $(document).off('keydown.tour'); // Remove namespaced event listener
    }

    function showStep(stepIndex)
    {
        // Clean up any existing tour elements
        cleanup();

        if (stepIndex < 0 || stepIndex >= steps.length)
        {
            return;
        }

        const step = steps[stepIndex];

        // Execute the step action first (switch tabs if needed)
        if (step.action)
        {
            executeStepAction(step.action);
        }

        // Small delay to ensure tab switching is complete before showing popover
        setTimeout(() =>
        {
            const overlay = createOverlay();
            const $element = $(step.element);

            if ($element.length === 0)
            {
                console.warn(`Element ${step.element} not found, skipping step`);
                return;
            }

            $element.addClass('driver-highlight');
            const popover = createPopover(step);
            popover.appendTo('body');

            // Handle Previous button
            popover.find('.prev').on('click', (e) =>
            {
                e.preventDefault();
                e.stopPropagation();
                if (currentStep > 0)
                {
                    currentStep--;
                    showStep(currentStep);
                }
            });

            // Handle Next button
            popover.find('.next').on('click', (e) =>
            {
                e.preventDefault();
                e.stopPropagation();
                if (currentStep < steps.length - 1)
                {
                    currentStep++;
                    showStep(currentStep);
                }
                else
                {
                    cleanup();
                    currentStep = 0; // Reset for next time
                }
            });

            // Handle Escape key (use namespaced event to avoid conflicts)
            $(document).on('keydown.tour', (e) =>
            {
                if (e.key === 'Escape')
                {
                    cleanup();
                    currentStep = 0;
                }
            });

            // Handle overlay click
            overlay.on('click', (e) =>
            {
                if (e.target === overlay[0])
                {
                    cleanup();
                    currentStep = 0;
                }
            });
        }, 100); // Small delay to ensure DOM is updated after tab switch
    }

    // Start the tour
    $('#start-guide').on('click', () =>
    {
        currentStep = 0;
        showStep(currentStep);
    });
});