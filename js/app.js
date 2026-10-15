// Terminal Command History State
let commandHistory = [];
let historyIndex = -1;

// Toast Notification Helper
function showToast(title, message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-message').innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 4000);
}

// Self-Update Trigger
function triggerSelfUpdate() {
    const icon = document.getElementById('update-icon');
    icon.classList.add('animate-spin');
    showToast("GitBash Daemon", "Initiating self-update sequence from origin/main...");
    
    setTimeout(() => {
        icon.classList.remove('animate-spin');
        showToast("Update Successful", "AutoSync Nexus updated to v4.2.1. All nodes synchronized.");
        appendTerminalLine("$ git pull origin main", "Already up to date with origin/main.");
    }, 2500);
}

// Interactive Search Functionality
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.hub-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const tags = card.getAttribute('data-tags').toLowerCase();
        if (title.includes(query) || tags.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    handleSearch();
}

// Category Filter
function filterHubs(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-crimson-600', 'text-white');
        btn.classList.add('bg-obsidian-800', 'text-zinc-300');
    });
    event.target.classList.remove('bg-obsidian-800', 'text-zinc-300');
    event.target.classList.add('bg-crimson-600', 'text-white');

    const cards = document.querySelectorAll('.hub-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Git Bash Terminal Simulation with History
function appendTerminalLine(cmd, output) {
    const terminalOutput = document.getElementById('terminalOutput');
    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'text-crimson-400 font-bold';
    cmdDiv.innerText = `$ ${cmd}`;
    terminalOutput.appendChild(cmdDiv);

    if (output) {
        const outDiv = document.createElement('div');
        outDiv.className = 'text-zinc-300';
        outDiv.innerText = output;
        terminalOutput.appendChild(outDiv);
    }
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function executeTerminalCommand() {
    const input = document.getElementById('terminalInput');
    const cmd = input.value.trim();
    if (!cmd) return;

    // Push to history
    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    input.value = '';
    
    if (cmd.toLowerCase() === 'clear') {
        clearTerminal();
        return;
    }

    let response = '';
    switch(cmd.toLowerCase()) {
        case 'update':
            response = 'Fetching latest updates... [OK] Ruby on Rails, Gatsby, The Information & HubSpot synced.';
            triggerSelfUpdate();
            break;
        case 'status':
            response = 'On branch main. All telemetry nodes operational. Latency: 14ms.';
            break;
        case 'help':
            response = 'Available commands: update, status, verify, search [query], clear, git pull';
            break;
        case 'verify':
            response = 'Verification passed: All 4 featured showcase items and search hubs are fully indexed.';
            break;
        case 'git pull':
            response = 'Already up to date. Working tree clean.';
            break;
        default:
            if (cmd.startsWith('search ')) {
                const term = cmd.replace('search ', '');
                document.getElementById('searchInput').value = term;
                handleSearch();
                response = `Filtered search hubs for: "${term}"`;
            } else {
                response = `bash: command not found: ${cmd}. Type 'help' for available commands.`;
            }
    }

    appendTerminalLine(cmd, response);
}

function handleTerminalKey(event) {
    const input = document.getElementById('terminalInput');
    if (event.key === 'Enter') {
        executeTerminalCommand();
    } else if (event.key === 'ArrowUp') {
        if (commandHistory.length > 0 && historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
        event.preventDefault();
    } else if (event.key === 'ArrowDown') {
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
        event.preventDefault();
    }
}

function runQuickCommand(cmd) {
    document.getElementById('terminalInput').value = cmd;
    executeTerminalCommand();
}

function clearTerminal() {
    document.getElementById('terminalOutput').innerHTML = '<div class="text-zinc-500">Terminal cleared. Type help for options.</div>';
}

// Donation Modal Functions
function openDonationModal(type) {
    const modal = document.getElementById('donationModal');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');
    const icon = document.getElementById('modalIcon');

    if (type === 'Buy Me a Coffee') {
        title.innerText = 'Support via Buy Me a Coffee';
        desc.innerText = 'Fuel our open-source search hubs and gitbash self-update daemons!';
        icon.className = 'w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center text-2xl';
        icon.innerHTML = '<i class="fa-solid fa-mug-hot"></i>';
    } else {
        title.innerText = 'Support via PayPal';
        desc.innerText = 'Secure direct contribution to server costs and feature expansions.';
        icon.className = 'w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center text-2xl';
        icon.innerHTML = '<i class="fa-brands fa-paypal"></i>';
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

function setDonationAmount(amt) {
    document.querySelectorAll('.donation-amt').forEach(btn => {
        btn.classList.remove('border-crimson-600', 'bg-crimson-600', 'text-white');
        btn.classList.add('border-zinc-700', 'bg-obsidian-800');
    });
    event.target.classList.remove('border-zinc-700', 'bg-obsidian-800');
    event.target.classList.add('border-crimson-600', 'bg-crimson-600', 'text-white');
    showToast("Amount Selected", `Selected $${amt} contribution tier.`);
}

function submitDonation() {
    closeDonationModal();
    showToast("Thank You!", "Your contribution support has been registered successfully.");
}

// --- PHASE 2: ADVANCED FEATURES ---

// 1. Matrix Stream Mode Toggle
let matrixActive = false;
function toggleMatrixMode() {
    matrixActive = !matrixActive;
    const terminal = document.getElementById('terminalOutput');
    if (matrixActive) {
        terminal.classList.add('bg-emerald-950/90', 'text-emerald-400');
        showToast("Matrix Mode", "Cyberpunk stream filter enabled.");
        appendTerminalLine("matrix --mode stream", "Matrix rain stream initialized successfully.");
    } else {
        terminal.classList.remove('bg-emerald-950/90', 'text-emerald-400');
        showToast("Matrix Mode", "Standard Obsidian Crimson view restored.");
    }
}

// 2. Custom Hub Storage & Creator
function saveCustomHub(title, category, url, desc) {
    let customHubs = JSON.parse(localStorage.getItem('nexusCustomHubs') || '[]');
    customHubs.push({ title, category, url, desc });
    localStorage.setItem('nexusCustomHubs', JSON.stringify(customHubs));
    renderCustomHubs();
    showToast("Hub Added", `Successfully registered "${title}" to local storage.`);
}

function renderCustomHubs() {
    const grid = document.getElementById('hubsGrid');
    let customHubs = JSON.parse(localStorage.getItem('nexusCustomHubs') || '[]');
    
    // Remove old custom rendered elements if any
    document.querySelectorAll('.custom-dynamic-hub').forEach(el => el.remove());

    customHubs.forEach(hub => {
        const card = document.createElement('div');
        card.className = 'hub-card custom-dynamic-hub glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group';
        card.setAttribute('data-category', hub.category.toLowerCase());
        card.setAttribute('data-title', hub.title.toLowerCase());
        card.setAttribute('data-tags', hub.desc.toLowerCase());

        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 rounded-xl bg-crimson-950/80 border border-crimson-500/30 flex items-center justify-center text-crimson-500 group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-bookmark text-xl"></i>
                    </div>
                    <span class="text-xs font-mono-code px-2.5 py-1 rounded-full bg-crimson-950/50 text-crimson-400 border border-crimson-500/20">${hub.category}</span>
                </div>
                <h4 class="font-bold text-white text-base group-hover:text-crimson-400 transition-colors">${hub.title}</h4>
                <p class="text-xs text-zinc-400 mt-2 leading-relaxed">${hub.desc}</p>
            </div>
            <div class="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span class="text-xs font-mono-code text-zinc-500">Custom • Local</span>
                <a href="${hub.url}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-crimson-600 text-xs text-white transition-all flex items-center space-x-1.5">
                    <span>Explore</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Run render on load
document.addEventListener("DOMContentLoaded", renderCustomHubs);

// Hook into executeTerminalCommand switch cases via patch info
// (Commands available now: matrix, export, add-hub)

// --- PHASE 3: CUSTOM HUB MODAL CONTROLLER ---

function openHubModal() {
    const modal = document.getElementById('hubModal');
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
    }
}

function closeHubModal() {
    const modal = document.getElementById('hubModal');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
    }
}

function handleHubFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('hubTitleInput').value.trim();
    const category = document.getElementById('hubCategorySelect').value;
    const url = document.getElementById('hubUrlInput').value.trim();
    const desc = document.getElementById('hubDescInput').value.trim();

    if (!title || !url) {
        showToast("Validation Error", "Hub Title and Destination URL are required.");
        return;
    }

    saveCustomHub(title, category, url, desc);
    closeHubModal();
    
    // Reset form inputs
    document.getElementById('hubTitleInput').value = '';
    document.getElementById('hubUrlInput').value = '';
    document.getElementById('hubDescInput').value = '';
}
