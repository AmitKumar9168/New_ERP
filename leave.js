document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const checkInButton = document.getElementById('check-in-btn');
    const checkOutButton = document.getElementById('check-out-btn');

    // Update the displayed date
    document.getElementById('current-date').innerText = formattedDate;

    // Check In Button Logic
    checkInButton.addEventListener('click', () => {
        const lastCheckIn = localStorage.getItem(`checkIn-${formattedDate}`);
        if (lastCheckIn) {
            alert('You have already checked in today.');
            return;
        }

        const checkInTime = new Date().toLocaleTimeString();
        localStorage.setItem(`checkIn-${formattedDate}`, checkInTime);
        alert(`Checked in at ${checkInTime}`);
        updateAttendanceRecord(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Check Out Button Logic
    checkOutButton.addEventListener('click', () => {
        const checkOutTime = new Date().toLocaleTimeString();
        localStorage.setItem(`checkOut-${formattedDate}`, checkOutTime);
        alert(`Checked out at ${checkOutTime}`);
        updateAttendanceRecord(currentDate.getMonth(), currentDate.getFullYear());
    });

    // Generate Calendar
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());

    // Calendar Navigation
    document.getElementById('prev-month').addEventListener('click', () => {
        const prevMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        generateCalendar(prevMonthDate.getMonth(), prevMonthDate.getFullYear());
    });

    document.getElementById('next-month').addEventListener('click', () => {
        const nextMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        generateCalendar(nextMonthDate.getMonth(), nextMonthDate.getFullYear());
    });

    // Attendance Record Table
    document.getElementById('attendance-record-table').addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const row = event.target.closest('tr');
            const date = row.cells[0].innerText;
            const checkInTime = row.cells[2].innerText;
            const checkOutTime = row.cells[3].innerText;
            updateAttendanceRecord(currentDate.getMonth(), currentDate.getFullYear());
        }
    });

    // Auto Check Out at Midnight IST
    const checkOutTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    function autoCheckOut() {
        const now = new Date();
        const formattedNow = now.toLocaleDateString();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);

        if (now.getTime() >= midnight.getTime()) {
            const checkInTime = localStorage.getItem(`checkIn-${formattedNow}`);
            if (checkInTime) {
                const checkOutTime = now.toLocaleTimeString();
                localStorage.setItem(`checkOut-${formattedNow}`, checkOutTime);
                updateAttendanceRecord(now.getMonth(), now.getFullYear());
            }
        }
    }

    // Check every minute if it’s midnight
    setInterval(autoCheckOut, 60000); // 60000 milliseconds = 1 minute

    function generateCalendar(month, year) {
        const calendarTable = document.getElementById('calendar-table');
        calendarTable.innerHTML = '';

        const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        const headerRow = document.createElement('tr');
        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.innerText = day;
            headerRow.appendChild(th);
        });
        calendarTable.appendChild(headerRow);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if (i === 0 && j < firstDay) {
                    cell.innerText = '';
                } else if (date > daysInMonth) {
                    break;
                } else {
                    cell.innerText = date;
                    const today = new Date();
                    if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        cell.style.backgroundColor = '#0077ff';
                    }
                    date++;
                }

                row.appendChild(cell);
            }

            calendarTable.appendChild(row);
        }

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        document.getElementById('current-month').innerText = `${monthNames[month]} ${year}`;

        // Update attendance record for the selected month and year
        updateAttendanceRecord(month, year);
    }

    function updateAttendanceRecord(month, year) {
        const attendanceTable = document.getElementById('attendance-record-table').getElementsByTagName('tbody')[0];
        attendanceTable.innerHTML = '';

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const formattedDate = date.toLocaleDateString();

            const checkInTime = localStorage.getItem(`checkIn-${formattedDate}`) || '-';
            const checkOutTime = localStorage.getItem(`checkOut-${formattedDate}`) || '-';
            const status = checkInTime !== '-' && checkOutTime !== '-' ? 'Present' : 'Absent';

            const duration = calculateDuration(checkInTime, checkOutTime);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${status}</td>
                <td>${checkInTime}</td>
                <td>${checkOutTime}</td>
                <td>${duration}</td>
                <td>-</td>
                <td><button class="edit-btn">Edit</button></td>
            `;
            attendanceTable.appendChild(row);
        }
    }

    function calculateDuration(checkInTime, checkOutTime) {
        if (checkInTime === '-' || checkOutTime === '-') {
            return '-';
        }

        const checkIn = new Date(`01/01/2000 ${checkInTime}`);
        const checkOut = new Date(`01/01/2000 ${checkOutTime}`);
        const diff = (checkOut - checkIn) / 1000 / 60 / 60;

        return diff > 0 ? `${diff.toFixed(2)} hours` : '-';
    }

    // Update leave balance (if applicable)
    const leaveBalance = {
        sickLeave: { used: 0, total: 9 },
        casualLeave: { used: 0, total: 9.5 },
        compOff: { used: 0, total: 4 }
    };

    function updateLeaveBalance() {
        document.getElementById('sick-leave-balance').innerText = `${leaveBalance.sickLeave.used}/${leaveBalance.sickLeave.total}`;
        document.getElementById('casual-leave-balance').innerText = `${leaveBalance.casualLeave.used}/${leaveBalance.casualLeave.total}`;
        document.getElementById('comp-off-balance').innerText = `${leaveBalance.compOff.used}/${leaveBalance.compOff.total}`;
    }

    updateLeaveBalance();
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    const updateBtn = document.getElementById('update-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const deleteBtn = document.getElementById('delete-btn');

    let currentEditRow = null;

    // Use event delegation to handle clicks on dynamically added edit buttons
    document.getElementById('attendance-record-table').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            e.preventDefault(); // Prevent default action of the button

            console.log('Edit button clicked'); // Debug message
            modal.style.display = 'block';
            currentEditRow = e.target.closest('tr');
            const cells = currentEditRow.cells;
            document.getElementById('status').value = cells[1].innerText;
            document.getElementById('check-in').value = cells[2].innerText;
            document.getElementById('check-out').value = cells[3].innerText;
            document.getElementById('remarks').value = cells[5].innerText;
        }
    });

    // Close modal
    const closeModal = () => {
        console.log('Closing modal'); // Debug message
        modal.style.display = 'none';
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Update attendance record
    updateBtn.addEventListener('click', () => {
        const status = document.getElementById('status').value.trim();
        const checkIn = document.getElementById('check-in').value.trim();
        const checkOut = document.getElementById('check-out').value.trim();
        const remarks = document.getElementById('remarks').value.trim();

        
        if (!status || !checkIn || !checkOut || !remarks) {
            alert('Please fill out all fields.');
            return;
        }

        currentEditRow.cells[1].innerText = status;
        currentEditRow.cells[2].innerText = checkIn;
        currentEditRow.cells[3].innerText = checkOut;
        currentEditRow.cells[5].innerText = remarks;

        closeModal();
    });

    // Delete attendance record
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this record?')) {
            currentEditRow.remove();
        }
        closeModal();
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
