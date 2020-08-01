// reusable autocomplete function
const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData,
}) => {
    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
    <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
    </div>
    </div>
  `;

    const resultsWrapper = root.querySelector('.results');
    const dropdown = root.querySelector('.dropdown');
    const input = root.querySelector('input');

    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const items = await fetchData(input.value);

            if (!items.length) {
                dropdown.classList.remove('is-active');
                return;
            }

            resultsWrapper.innerHTML = '';

            dropdown.classList.add('is-active');
            for (let item of items) {
                const option = document.createElement('a');

                option.classList.add('dropdown-item');
                option.innerHTML = renderOption(item);

                option.addEventListener('click', () => {
                    dropdown.classList.remove('is-active');
                    input.value = inputValue(item);
                    onOptionSelect(item);
                });

                resultsWrapper.appendChild(option);
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};
