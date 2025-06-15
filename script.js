document.addEventListener('DOMContentLoaded', () => {
    const meals = {
        'Chicken Burger': {
            type: 'single',
            price: 15.99,
            variations: [],
            description: 'Classic chicken burger with lettuce, tomato, and mayo'
        },
        'Snitzel': {
            type: 'multi',
            price: 18.99,
            variations: [
                { name: 'Type', options: ['Chicken', 'Beef'] },
                { name: 'Size', options: ['Small', 'Large'] },
                { name: 'Sides', options: ['Chips', 'Veggies'] },
                { name: 'Sauce', options: ['Pepper Sauce', 'Gravy'] }
            ],
            description: 'Crispy schnitzel with your choice of sides and sauce'
        },
        'Fish and Chips': {
            type: 'single',
            price: 16.99,
            variations: [],
            description: 'Battered fish with crispy chips'
        },
        'Beef Burger': {
            type: 'single',
            price: 17.99,
            variations: [],
            description: 'Juicy beef burger with cheese, lettuce, tomato, and mayo'
        }
    };
    const orders = {};

    function renderMeals() {
        const mealsContainer = document.querySelector('.meals');
        mealsContainer.innerHTML = '';

        Object.entries(meals).forEach(([mealName, meal]) => {
            const mealCard = document.createElement('div');
            mealCard.className = 'meal-card';
            mealCard.innerHTML = `
                <h3>${mealName}</h3>
                <p>${meal.description}</p>
                <p class="price">$${meal.price.toFixed(2)}</p>
                ${meal.type === 'multi' ? '<p>Customizable options available</p>' : ''}
            `;
            
            mealCard.addEventListener('click', () => {
                if (meal.type === 'multi') {
                    showCustomizationModal(mealName, meal);
                } else {
                    addOrder(mealName, meal);
                }
            });

            // Add a "Customize" button for multi-option meals
            if (meal.type === 'multi') {
                const customizeBtn = document.createElement('button');
                customizeBtn.textContent = 'Customize';
                customizeBtn.className = 'customize-btn';
                mealCard.appendChild(customizeBtn);
            }

            mealsContainer.appendChild(mealCard);
        });
    }

    function addOrder(mealName, meal, selectedVariations = null) {
        // Create a unique key for this variation
        const variationKey = getVariationKey(selectedVariations);
        const orderKey = `${mealName}-${variationKey}`;

        if (!orders[orderKey]) {
            orders[orderKey] = { 
                count: 1, 
                mealName: mealName,
                variations: selectedVariations || {}
            };
        } else {
            orders[orderKey].count++;
        }
        renderOrders();
    }

    function getVariationKey(variations) {
        if (!variations || Object.keys(variations).length === 0) return 'default';
        return Object.entries(variations)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}-${value}`)
            .join('-');
    }

    function showCustomizationModal(mealName, meal) {
        const modal = document.getElementById('customization-modal');
        const modalTitle = document.getElementById('modal-title');
        const optionsContainer = document.getElementById('customization-options');
        const confirmBtn = document.getElementById('confirm-customization');
        const cancelBtn = document.getElementById('cancel-customization');

        modalTitle.textContent = `Customize ${mealName}`;
        
        // Clear previous options
        optionsContainer.innerHTML = '';

        // Create option groups
        meal.variations.forEach(variation => {
            const optionGroup = document.createElement('div');
            optionGroup.className = 'option-group';
            
            const label = document.createElement('label');
            label.textContent = variation.name;
            optionGroup.appendChild(label);

            const select = document.createElement('select');
            select.name = variation.name;
            variation.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });
            optionGroup.appendChild(select);
            
            optionsContainer.appendChild(optionGroup);
        });

        // Show modal
        modal.style.display = 'block';

        // Handle confirmation
        confirmBtn.onclick = () => {
            const selectedVariations = {};
            optionsContainer.querySelectorAll('select').forEach(select => {
                selectedVariations[select.name] = select.value;
            });
            addOrder(mealName, meal, selectedVariations);
            hideModal();
        };

        // Handle cancellation
        cancelBtn.onclick = () => hideModal();

        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                hideModal();
            }
        };
    }

    function hideModal() {
        const modal = document.getElementById('customization-modal');
        modal.style.display = 'none';
    }

    function renderOrders() {
        const ordersContainer = document.getElementById('orders-container');
        ordersContainer.innerHTML = '';

        Object.entries(orders).forEach(([orderKey, order]) => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            let orderText = `${order.mealName} x${order.count}`;
            if (Object.keys(order.variations).length > 0) {
                orderText += ' (' + Object.entries(order.variations)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ') + ')';
            }

            const quantityControls = document.createElement('div');
            quantityControls.className = 'quantity-controls';
            
            const decreaseBtn = document.createElement('button');
            decreaseBtn.textContent = '-';
            decreaseBtn.onclick = () => decreaseCount(orderKey);
            
            const countSpan = document.createElement('span');
            countSpan.textContent = `x${order.count}`;
            
            const increaseBtn = document.createElement('button');
            increaseBtn.textContent = '+';
            increaseBtn.onclick = () => increaseCount(orderKey);

            quantityControls.appendChild(decreaseBtn);
            quantityControls.appendChild(countSpan);
            quantityControls.appendChild(increaseBtn);

            orderItem.innerHTML = `<span>${orderText}</span>`;
            orderItem.appendChild(quantityControls);

            ordersContainer.appendChild(orderItem);
        });
    }

    function decreaseCount(orderKey) {
        if (orders[orderKey].count > 1) {
            orders[orderKey].count--;
        } else {
            delete orders[orderKey];
        }
        renderOrders();
    }

    function increaseCount(orderKey) {
        orders[orderKey].count++;
        renderOrders();
    }

    function decreaseCount(mealName) {
        if (orders[mealName].count > 1) {
            orders[mealName].count--;
        } else {
            delete orders[mealName];
        }
        renderOrders();
    }

    function increaseCount(mealName) {
        orders[mealName].count++;
        renderOrders();
    }

    document.getElementById('clear-orders').addEventListener('click', () => {
        orders = {};
        renderOrders();
    });

    // Initialize the meal list
    renderMeals();
});
