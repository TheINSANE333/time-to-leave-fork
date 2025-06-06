$(document).ready(() => {
    const steps = [
        {
            element: '#theme-toggle',
            title: 'Theme Toggle',
            description: 'Switch between light and dark modes to suit your preference'
        },
        {
            element: '#calendar',
            title: 'Calendar',
            description: 'View and manage your work hours calendar here'
        },
        {
            element: '#countdown',
            title: 'Time Remaining',
            description: 'See your remaining work time for today'
        }
    ];

    let currentStep = 0;

    function createOverlay() {
        return $('<div>').addClass('driver-overlay').appendTo('body');
    }

    function createPopover(step) {
        const $popover = $('<div>').addClass('driver-popover').html(`
            <h4>${step.title}</h4>
            <p>${step.description}</p>
            <div>
                <button class="driver-btn prev" ${currentStep === 0 ? 'disabled' : ''}>Previous</button>
                <button class="driver-btn next">${currentStep === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
        `);

        const $element = $(step.element);
        if ($element.length === 0) {
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

    function cleanup() {
        $('.driver-overlay').remove();
        $('.driver-popover').remove();
        $('.driver-highlight').removeClass('driver-highlight');
        $(document).off('keydown.tour'); // Remove namespaced event listener
    }

    function showStep(stepIndex) {
        // Clean up any existing tour elements
        cleanup();
        
        if (stepIndex < 0 || stepIndex >= steps.length) {
            return;
        }

        const overlay = createOverlay();
        const step = steps[stepIndex];
        const $element = $(step.element);
        
        if ($element.length === 0) {
            console.warn(`Element ${step.element} not found, skipping step`);
            return;
        }
        
        $element.addClass('driver-highlight');
        const popover = createPopover(step);
        popover.appendTo('body');

        // Handle Previous button
        popover.find('.prev').on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });

        // Handle Next button
        popover.find('.next').on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            } else {
                cleanup();
                currentStep = 0; // Reset for next time
            }
        });

        // Handle Escape key (use namespaced event to avoid conflicts)
        $(document).on('keydown.tour', (e) => {
            if (e.key === 'Escape') {
                cleanup();
                currentStep = 0;
            }
        });

        // Handle overlay click
        overlay.on('click', (e) => {
            if (e.target === overlay[0]) {
                cleanup();
                currentStep = 0;
            }
        });
    }

    // Start the tour
    $('#start-guide').on('click', () => {
        currentStep = 0;
        showStep(currentStep);
    });
});