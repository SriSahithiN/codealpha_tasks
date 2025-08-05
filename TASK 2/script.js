        const taskInput = document.getElementById('task-input');
        const dueDateInput = document.getElementById('due-date-input');
        const priorityInput = document.getElementById('priority-input');
        const categoryInput = document.getElementById('category-input');
        const addButton = document.getElementById('add-button');
        const taskList = document.getElementById('task-list');
        const emptyMessage = document.getElementById('empty-message');
        const celebrationMessage = document.getElementById('celebration-message');
        const filterButtons = document.querySelectorAll('#filter-buttons .filter-button');
        const clearCompletedButton = document.getElementById('clear-completed-button');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const moonIcon = document.getElementById('moon-icon');
        const sunIcon = document.getElementById('sun-icon');
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        let currentFilter = 'all';
        let currentSort = 'default';
        let draggedItem = null;
        let tasks = []; // In-memory array of tasks

        // Function to create a new task object
        function createAndSaveTask(taskText, isCompleted = false) {
            if (taskText.trim() === '') return;

            const taskId = Date.now().toString();
            const task = {
                id: taskId,
                text: taskText,
                completed: isCompleted,
                dueDate: dueDateInput.value,
                priority: priorityInput.value,
                categories: categoryInput.value.split(',').map(c => c.trim()).filter(c => c !== ''),
                subtasks: []
            };

            tasks.push(task);
            saveTasksToLocalStorage();
            filterAndSortTasks();

            taskInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'medium';
            categoryInput.value = '';
            taskInput.focus();
        }

        // Save tasks to localStorage
        function saveTasksToLocalStorage() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        // Load tasks from localStorage
        function loadTasks() {
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                tasks = JSON.parse(storedTasks);
            }
            filterAndSortTasks();
        }

        // Function to render all tasks
        function renderTasks(tasksToRender) {
            taskList.innerHTML = '';
            if (tasksToRender.length === 0 && tasks.length > 0) {
                // If the filtered/searched list is empty but overall list isn't, hide the empty message
                emptyMessage.classList.add('hidden');
            } else {
                emptyMessage.classList.toggle('hidden', tasksToRender.length > 0);
            }
            
            tasksToRender.forEach(task => {
                const li = document.createElement('li');
                li.setAttribute('data-id', task.id);
                li.setAttribute('draggable', true);
                li.className = `flex flex-col space-y-2 bg-gray-50 p-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out border-l-4 ${getPriorityClass(task.priority)} ${task.completed ? 'task-completed' : ''}`;
                li.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4 flex-grow">
                            <input type="checkbox" class="form-checkbox h-6 w-6 text-blue-600 rounded-md focus:ring-blue-500 cursor-pointer" ${task.completed ? 'checked' : ''}>
                            <div class="flex flex-col">
                                <span class="task-text text-lg text-gray-800 font-semibold break-words">${task.text}</span>
                                <div class="text-sm text-gray-500 mt-1 flex items-center space-x-4">
                                    ${task.dueDate ? `<span><i class="far fa-calendar-alt mr-1"></i>${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                                    <span><i class="fas ${getPriorityIcon(task.priority)} text-${getPriorityColor(task.priority)}-500 mr-1"></i>${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 ml-4">
                            <button class="add-subtask-button p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors duration-200" title="Add subtask"><i class="fas fa-plus"></i></button>
                            <button class="edit-button p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors duration-200" title="Edit task"><i class="fas fa-pen"></i></button>
                            <button class="delete-button p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200" title="Delete task"><i class="fas fa-trash-can"></i></button>
                        </div>
                    </div>
                    ${task.categories.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${task.categories.map(cat => `<span class="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">${cat}</span>`).join('')}
                        </div>
                    ` : ''}
                    <ul class="subtask-list space-y-2 mt-2 pl-6 border-l-2 border-gray-200">
                        ${task.subtasks.map(subtask => `
                            <li data-id="${subtask.id}" class="flex items-center justify-between p-2 rounded-md ${subtask.completed ? 'task-completed' : ''}">
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600 rounded-md cursor-pointer" ${subtask.completed ? 'checked' : ''}>
                                    <span class="subtask-text text-gray-700">${subtask.text}</span>
                                </div>
                                <button class="delete-subtask-button text-red-400 hover:text-red-600 transition-colors duration-200" title="Delete subtask"><i class="fas fa-xmark"></i></button>
                            </li>
                        `).join('')}
                    </ul>
                `;
                taskList.appendChild(li);
            });
            attachEventListeners();
            updateProgress();
            updateMessages();
        }

        // Helper functions for priority
        function getPriorityClass(priority) {
            switch (priority) {
                case 'low': return 'priority-low';
                case 'medium': return 'priority-medium';
                case 'high': return 'priority-high';
                default: return 'border-gray-200';
            }
        }
        
        function getPriorityIcon(priority) {
            switch (priority) {
                case 'low': return 'fa-circle-down';
                case 'medium': return 'fa-grip-lines';
                case 'high': return 'fa-circle-up';
                default: return 'fa-info-circle';
            }
        }

        function getPriorityColor(priority) {
            switch (priority) {
                case 'low': return 'blue';
                case 'medium': return 'yellow';
                case 'high': return 'red';
                default: return 'gray';
            }
        }

        // Attach event listeners to dynamically created elements
        function attachEventListeners() {
            document.querySelectorAll('.form-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const li = e.target.closest('li[data-id]');
                    const taskId = li.dataset.id;
                    const isMainTaskCheckbox = e.target.closest('.subtask-list') === null;

                    if (isMainTaskCheckbox) {
                        const task = tasks.find(t => t.id === taskId);
                        if (task) {
                            task.completed = e.target.checked;
                            li.classList.toggle('task-completed', e.target.checked);
                            // Also mark all subtasks as completed
                            task.subtasks.forEach(sub => sub.completed = e.target.checked);
                            li.querySelectorAll('.subtask-list input[type="checkbox"]').forEach(subCheckbox => subCheckbox.checked = e.target.checked);
                        }
                    } else { // It's a subtask checkbox
                        const subtaskId = e.target.closest('li').dataset.id;
                        const task = tasks.find(t => t.id === taskId);
                        if (task) {
                            const subtask = task.subtasks.find(s => s.id === subtaskId);
                            if (subtask) {
                                subtask.completed = e.target.checked;
                                // If all subtasks are completed, mark the main task as completed
                                if (task.subtasks.every(s => s.completed)) {
                                    task.completed = true;
                                    li.classList.add('task-completed');
                                    li.querySelector('.form-checkbox').checked = true;
                                } else {
                                    task.completed = false;
                                    li.classList.remove('task-completed');
                                    li.querySelector('.form-checkbox').checked = false;
                                }
                            }
                        }
                    }
                    saveTasksToLocalStorage();
                    filterAndSortTasks();
                });
            });

            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const li = e.target.closest('li[data-id]');
                    const taskId = li.dataset.id;
                    editTask(li, taskId);
                });
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const li = e.target.closest('li[data-id]');
                    const taskId = li.dataset.id;
                    deleteTask(li, taskId);
                });
            });

            document.querySelectorAll('.add-subtask-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const li = e.target.closest('li[data-id]');
                    const taskId = li.dataset.id;
                    addSubtask(li, taskId);
                });
            });

            document.querySelectorAll('.delete-subtask-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const li = e.target.closest('li[data-id]');
                    const subtaskId = e.target.closest('li').dataset.id;
                    const taskId = li.dataset.id;
                    deleteSubtask(li, taskId, subtaskId);
                });
            });
        }

        // --- Drag-and-Drop Event Handlers ---
        function handleDragStart(e) {
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
            setTimeout(() => e.target.classList.add('opacity-50'), 0);
        }

        function handleDragOver(e) {
            e.preventDefault();
            const targetItem = e.target.closest('li[data-id]');
            if (targetItem && targetItem !== draggedItem) {
                const rect = targetItem.getBoundingClientRect();
                const offset = e.clientY - rect.top;
                const isAfter = offset > rect.height / 2;
                
                taskList.insertBefore(draggedItem, isAfter ? targetItem.nextSibling : targetItem);
            }
        }

        function handleDrop(e) {
            e.preventDefault();
        }

        function handleDragEnd(e) {
            e.target.classList.remove('opacity-50');
            draggedItem = null;
            updateTaskOrderInLocalStorage();
        }

        function updateTaskOrderInLocalStorage() {
            const newOrder = Array.from(taskList.children).map(li => li.dataset.id);
            const taskMap = tasks.reduce((acc, task) => {
                acc[task.id] = task;
                return acc;
            }, {});
            tasks = newOrder.map(id => taskMap[id]);
            saveTasksToLocalStorage();
        }

        // Function to handle the editing of a task
        function editTask(li, taskId) {
            const taskTextSpan = li.querySelector('.task-text');
            const currentText = taskTextSpan.textContent;
            
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = currentText;
            editInput.className = "flex-grow p-1 border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-lg task-input";

            taskTextSpan.parentNode.replaceChild(editInput, taskTextSpan);
            editInput.focus();

            const saveEdit = () => {
                const newText = editInput.value.trim();
                if (newText) {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        task.text = newText;
                        saveTasksToLocalStorage();
                        filterAndSortTasks();
                    }
                } else {
                    filterAndSortTasks(); // Revert to original text if empty
                }
            };

            editInput.addEventListener('blur', saveEdit);
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });
        }
        
        // Function to add a subtask
        function addSubtask(li, taskId) {
            const subtaskInput = document.createElement('input');
            subtaskInput.type = 'text';
            subtaskInput.placeholder = "New subtask...";
            subtaskInput.className = "p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-sm w-full task-input";
            
            const subtaskList = li.querySelector('.subtask-list');
            const tempLi = document.createElement('li');
            tempLi.appendChild(subtaskInput);
            subtaskList.appendChild(tempLi);
            subtaskInput.focus();

            const saveSubtask = () => {
                const subtaskText = subtaskInput.value.trim();
                if (subtaskText) {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        const subtaskId = Date.now().toString();
                        task.subtasks.push({ id: subtaskId, text: subtaskText, completed: false });
                        saveTasksToLocalStorage();
                        filterAndSortTasks();
                    }
                }
                tempLi.remove();
            };

            subtaskInput.addEventListener('blur', saveSubtask);
            subtaskInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveSubtask();
                }
            });
        }

        // Function to delete a subtask
        function deleteSubtask(li, taskId, subtaskId) {
            const subtaskLi = li.querySelector(`li[data-id='${subtaskId}']`);
            if (subtaskLi) {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.subtasks = task.subtasks.filter(s => s.id !== subtaskId);
                    saveTasksToLocalStorage();
                    filterAndSortTasks();
                }
            }
        }


        // Function to delete a main task
        function deleteTask(li, taskId) {
            li.classList.add('fade-out');
            setTimeout(() => {
                li.remove();
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasksToLocalStorage();
                updateProgress();
                updateMessages();
                filterAndSortTasks();
            }, 300);
        }

        // Function to update the progress bar and counter
        function updateProgress() {
            const totalTasks = tasks.length;
            if (totalTasks === 0) {
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
                return;
            }
            const completedTasks = tasks.filter(task => task.completed).length;
            const progress = Math.round((completedTasks / totalTasks) * 100);
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
        }
        
        // Function to show/hide the empty list or celebration messages
        function updateMessages() {
            const allCompleted = tasks.length > 0 && tasks.every(task => task.completed);
            
            emptyMessage.classList.toggle('hidden', tasks.length > 0);
            celebrationMessage.classList.toggle('hidden', !allCompleted);
        }

        // Function to filter and sort tasks
        function filterAndSortTasks() {
            let filteredTasks = tasks;

            // Apply search filter first
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredTasks = filteredTasks.filter(task => 
                    task.text.toLowerCase().includes(searchTerm) || 
                    task.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
                    task.subtasks.some(sub => sub.text.toLowerCase().includes(searchTerm))
                );
            }

            // Apply completion filter
            switch (currentFilter) {
                case 'active':
                    filteredTasks = filteredTasks.filter(task => !task.completed);
                    break;
                case 'completed':
                    filteredTasks = filteredTasks.filter(task => task.completed);
                    break;
                case 'all':
                default:
                    break;
            }

            // Apply sort
            switch (currentSort) {
                case 'priority':
                    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
                    filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                    break;
                case 'duedate':
                    filteredTasks.sort((a, b) => {
                        if (!a.dueDate) return 1;
                        if (!b.dueDate) return -1;
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    });
                    break;
                case 'default':
                default:
                    // Default order is based on creation time, which is already how they're loaded
                    break;
            }

            renderTasks(filteredTasks);

            // Update active state of filter buttons
            filterButtons.forEach(button => {
                button.classList.toggle('active', button.dataset.filter === currentFilter);
                if (button.dataset.filter === currentFilter) {
                    button.classList.add('text-white', 'bg-blue-600', 'hover:bg-blue-700');
                    button.classList.remove('text-gray-600', 'bg-gray-200', 'hover:bg-gray-300');
                } else {
                    button.classList.remove('text-white', 'bg-blue-600', 'hover:bg-blue-700');
                    button.classList.add('text-gray-600', 'bg-gray-200', 'hover:bg-gray-300');
                }
            });
        }
        
        // Due Date Notification logic
        function checkDueDates() {
            const today = new Date().toISOString().split('T')[0];
            tasks.forEach(task => {
                if (task.dueDate && task.dueDate === today && !task.completed) {
                    // You could implement a more sophisticated UI notification here (e.g., a modal or banner)
                    // For now, a simple console log will suffice as an example.
                    console.log(`Reminder: Task "${task.text}" is due today!`);
                }
            });
        }
        
        // Event listener for the "Add Task" button
        addButton.addEventListener('click', () => {
            createAndSaveTask(taskInput.value);
        });

        // Event listener to allow adding tasks by pressing the Enter key
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addButton.click();
            }
        });
        
        // Event listeners for the filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentFilter = button.dataset.filter;
                filterAndSortTasks();
            });
        });

        // Event listener for the "Clear All Completed" button
        clearCompletedButton.addEventListener('click', () => {
            tasks = tasks.filter(task => !task.completed);
            saveTasksToLocalStorage();
            filterAndSortTasks();
        });

        // Event listener for the sort dropdown
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndSortTasks();
        });

        // Event listener for the search input
        searchInput.addEventListener('input', () => {
            filterAndSortTasks();
        });

        // Dark mode toggle functionality
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            moonIcon.classList.toggle('hidden');
            sunIcon.classList.toggle('hidden');
        });

        // Initial load of tasks from localStorage
        window.addEventListener('load', loadTasks);
        
        // Set up due date checking
        // This is a simple implementation. In a real app, you'd use a more robust
        // notification system or a server-side solution.
        setInterval(checkDueDates, 60000); // Check every minute