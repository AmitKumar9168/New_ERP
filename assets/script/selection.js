document.addEventListener('DOMContentLoaded', function() {
    var semSelectors = document.querySelectorAll('.sem');

    semSelectors.forEach(function(semSelector) {
        semSelector.addEventListener('change', function() {
            var semester = this.value;
            var subSelector = this.closest('tr').querySelector('.sub1');

            // Clear existing options
            subSelector.innerHTML = '';

            if (semester === 'sem1') {
                subSelector.disabled = false;
                subSelector.innerHTML = '<option disabled selected>Select Sem 1 Sub</option>' +
                                        '<option value="sub1">Subject 1</option>' +
                                        '<option value="sub2">Subject 2</option>' +
                                        '<option value="sub3">Subject 3</option>' +
                                        '<option value="sub4">Subject 4</option>';
            } else if (semester === 'sem2') {
                subSelector.disabled = false;
                subSelector.innerHTML = '<option disabled selected>Select Sem 2 Sub</option>' +
                                        '<option value="sub12">Subject 12</option>' +
                                        '<option value="sub22">Subject 22</option>' +
                                        '<option value="sub32">Subject 32</option>' +
                                        '<option value="sub42">Subject 42</option>';
            } else {
                subSelector.disabled = true;
                subSelector.innerHTML = '<option disabled selected>Select Semester First</option>';
            }
        });
    });
});
