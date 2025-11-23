import { ref, computed } from 'vue';
import CaptureService from '../services/captureService.js';

export function useDHIS2Capture() {
    const orgUnits = ref([]);
    const programs = ref([]);
    const selectedOrgUnit = ref('');
    const selectedProgram = ref('');
    const selectedProgramStage = ref('');
    const viewMode = ref('list'); // 'list' or 'form'
    const events = ref([]);
    const loading = ref(false);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalEvents = ref(0);
    const sortColumn = ref('');
    const sortDirection = ref('asc');

    // Org Unit Tree State
    const expandedOrgUnits = ref(new Set());
    const selectedOrgUnitPath = ref([]);

    // Form State
    const currentEvent = ref(null);
    const formData = ref({});
    const formErrors = ref({});

    // Load organization units
    const loadOrgUnits = async () => {
        try {
            loading.value = true;
            const response = await CaptureService.getOrgUnits();
            orgUnits.value = buildOrgUnitTree(response);
        } catch (error) {
            console.error('Error loading org units:', error);
        } finally {
            loading.value = false;
        }
    };

    // Build hierarchical org unit tree
    const buildOrgUnitTree = (flatList) => {
        const tree = [];
        const map = new Map();

        flatList.forEach(ou => {
            map.set(ou.id, { ...ou, children: [] });
        });

        flatList.forEach(ou => {
            if (ou.parent) {
                const parent = map.get(ou.parent);
                if (parent) {
                    parent.children.push(map.get(ou.id));
                }
            } else {
                tree.push(map.get(ou.id));
            }
        });

        return tree;
    };

    // Toggle org unit expansion
    const toggleOrgUnit = (ouId) => {
        if (expandedOrgUnits.value.has(ouId)) {
            expandedOrgUnits.value.delete(ouId);
        } else {
            expandedOrgUnits.value.add(ouId);
        }
    };

    // Select org unit
    const selectOrgUnit = (ou) => {
        selectedOrgUnit.value = ou.id;
        selectedOrgUnitPath.value = getOrgUnitPath(ou);
        loadEvents();
    };

    // Get breadcrumb path for selected org unit
    const getOrgUnitPath = (ou) => {
        const path = [ou];
        let current = ou;

        while (current.parent) {
            const parent = findOrgUnitById(orgUnits.value, current.parent);
            if (parent) {
                path.unshift(parent);
                current = parent;
            } else {
                break;
            }
        }

        return path;
    };

    // Find org unit by ID in tree
    const findOrgUnitById = (tree, id) => {
        for (const ou of tree) {
            if (ou.id === id) return ou;
            if (ou.children?.length) {
                const found = findOrgUnitById(ou.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Load programs
    const loadPrograms = async () => {
        try {
            const response = await CaptureService.getDataSets();
            programs.value = response;
            if (response.length > 0) {
                selectedProgram.value = response[0].id;
            }
        } catch (error) {
            console.error('Error loading programs:', error);
        }
    };

    // Load events/registrations
    const loadEvents = async () => {
        if (!selectedOrgUnit.value || !selectedProgram.value) return;

        try {
            loading.value = true;
            const response = await CaptureService.getEvents({
                orgUnit: selectedOrgUnit.value,
                program: selectedProgram.value,
                page: currentPage.value,
                pageSize: pageSize.value,
                search: searchQuery.value,
                sortBy: sortColumn.value,
                sortDirection: sortDirection.value
            });

            events.value = response.events || [];
            totalEvents.value = response.total || 0;
        } catch (error) {
            console.error('Error loading events:', error);
            events.value = [];
        } finally {
            loading.value = false;
        }
    };

    // Register new event
    const registerNewEvent = () => {
        viewMode.value = 'form';
        currentEvent.value = null;
        formData.value = {};
        formErrors.value = {};
    };

    // Edit event
    const editEvent = (event) => {
        viewMode.value = 'form';
        currentEvent.value = event;
        formData.value = { ...event };
        formErrors.value = {};
    };

    // View event details
    const viewEvent = (event) => {
        currentEvent.value = event;
        // Open event details modal or navigate to view
    };

    // Save event
    const saveEvent = async () => {
        try {
            // Validate form
            if (!validateForm()) {
                return { success: false, error: 'Please fix form errors' };
            }

            loading.value = true;

            const eventData = {
                ...formData.value,
                orgUnit: selectedOrgUnit.value,
                program: selectedProgram.value,
                programStage: selectedProgramStage.value
            };

            let response;
            if (currentEvent.value) {
                // Update existing event
                response = await CaptureService.updateEvent(currentEvent.value.id, eventData);
            } else {
                // Create new event
                response = await CaptureService.createEvent(eventData);
            }

            if (response.success) {
                viewMode.value = 'list';
                await loadEvents();
            }

            return response;
        } catch (error) {
            console.error('Error saving event:', error);
            return { success: false, error: error.message };
        } finally {
            loading.value = false;
        }
    };

    // Validate form
    const validateForm = () => {
        formErrors.value = {};
        let isValid = true;

        // Add validation logic here

        return isValid;
    };

    // Cancel form
    const cancelForm = () => {
        viewMode.value = 'list';
        currentEvent.value = null;
        formData.value = {};
        formErrors.value = {};
    };

    // Delete event
    const deleteEvent = async (eventId) => {
        try {
            const confirmed = confirm('Are you sure you want to delete this event?');
            if (!confirmed) return;

            loading.value = true;
            const response = await CaptureService.deleteEvent(eventId);

            if (response.success) {
                await loadEvents();
            }

            return response;
        } catch (error) {
            console.error('Error deleting event:', error);
            return { success: false, error: error.message };
        } finally {
            loading.value = false;
        }
    };

    // Search events
    const searchEvents = debounce(() => {
        currentPage.value = 1;
        loadEvents();
    }, 300);

    // Sort events
    const sortEvents = (column) => {
        if (sortColumn.value === column) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn.value = column;
            sortDirection.value = 'asc';
        }
        loadEvents();
    };

    // Pagination
    const goToPage = (page) => {
        currentPage.value = page;
        loadEvents();
    };

    const totalPages = computed(() => {
        return Math.ceil(totalEvents.value / pageSize.value);
    });

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    return {
        // State
        orgUnits,
        programs,
        selectedOrgUnit,
        selectedProgram,
        selectedProgramStage,
        viewMode,
        events,
        loading,
        searchQuery,
        currentPage,
        pageSize,
        totalEvents,
        totalPages,
        sortColumn,
        sortDirection,
        expandedOrgUnits,
        selectedOrgUnitPath,
        currentEvent,
        formData,
        formErrors,

        // Methods
        loadOrgUnits,
        loadPrograms,
        loadEvents,
        toggleOrgUnit,
        selectOrgUnit,
        registerNewEvent,
        editEvent,
        viewEvent,
        saveEvent,
        cancelForm,
        deleteEvent,
        searchEvents,
        sortEvents,
        goToPage
    };
}
