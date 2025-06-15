document.addEventListener('DOMContentLoaded', () => {
    const meals = {
        'Cascade Burger': {
            type: 'single',
            variations: [],
            description: 'House-made tender beef patty, bacon, beetroot, egg, lettuce, tomato, caramelised onion, cheese & tomato chutney, served with a side of beer battered fries'
        },
        'Chicken Burger': {
            type: 'single',
            variations: [],
            description: 'Marinated Free Range chicken breast with lettuce, tomato, aioli, bacon, cheese & tomato chutney, served with a side of beer battered fries'
        },
        'Wallaby Burger': {
            type: 'single',
            variations: [],
            description: 'Tender Tassie smoky marinated wallaby fillet, lettuce, tomato, caramelised onion & tomato chutney, served with a side of beer battered fries'
        },
        'Moroccan Chickpea Burger': {
            type: 'single',
            variations: [],
            description: 'Grilled chickpea burger with smashed avocado, tomato, lettuce & tomato chutney, served with a side of beer battered fries'
        },
        'Fish of the Day': {
            type: 'single',
            variations: [],
            description: 'See our Specials Board for the latest Aquatic Extravaganza or ask any of the Cascade Team'
        },
        'Subterranean Pie': {
            type: 'multi',
            variations: [
                { name: 'Size', options: ['Small', 'Large'] },
            ],
            description: 'Twice cooked rabbit braised in a rich sauce served with creamy mash & braised black lentils'
        },
        'Roast of the Day': {
            type: 'multi',
            variations: [
                { name: 'Size', options: ['Small', 'Large'] },
            ],
            description: 'See our Specials Board'
        },
        'Chicken Parma': {
            type: 'multi',
            variations: [
                { name: 'Size', options: ['Small', 'Large'] },
                { name: 'Sides', options: ['Chips & Salad', 'Veggies'] }
            ],
            description: 'Free Range chicken breast served crumbed or pan-fried (gf) with house-made Napoli sauce, ham & mozzarella, served with salad & beer battered fries, or seasonal vegetables'
        },
        'Chicken Snitzel': {
            type: 'multi',
            variations: [
                { name: 'Size', options: ['Small', 'Large'] },
                { name: 'Sides', options: ['Chips & Salad', 'Veggies'] },
                { name: 'Sauce', options: ['Gravy', 'Mushroom', 'Pepper'] }
            ],
            description: 'Free Range chicken breast served crumbed or pan-fried (gf) with salad & beer battered fries, or seasonal vegetables & your choice of sauce'
        },
        'Siceys Super Beef Snitzel': {
            type: 'multi',
            variations: [
                { name: 'Size', options: ['Small', 'Large'] },
                { name: 'Sides', options: ['Chips & Salad', 'Veggies'] },
                { name: 'Sauce', options: ['Gravy', 'Mushroom', 'Pepper'] }
            ],
            description: 'Free Range chicken breast served crumbed or pan-fried (gf) with salad & beer battered fries, or seasonal vegetables & your choice of sauce'
        },
        'Bowl of chips': {
            type: 'single',
            variations: [],
            description: 'Bowl of beer battered chips'
        },
        'Choc fudge Brownie': {
            type: 'single',
            variations: [],
            description: 'Can it get any better than this?'
        },
        'Fish & Chips': {
            type: 'multi',
            variations: [
                { name: 'Size', options: ['Small', 'Large'] },
            ],
            description: 'Served with beer battered fries, salad & house-made tartare'
        },
        'Rissoles': {
            type: 'multi',
            variations: [
                { name: 'Size', options: ['Small', 'Large'] },
            ],
            description: 'Served on creamy mash with a rich gravy'
        }
    };
    const orders = {};

    function formatOrdersForCopy() {
        let text = 'Meal Orders:\n\n';
        
        Object.values(orders).forEach(order => {
            let orderText = `${order.mealName} x${order.count}`;
            if (Object.keys(order.variations).length > 0) {
                orderText += ' (' + Object.entries(order.variations)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ') + ')';
            }
            text += `${orderText}\n`;
        });

        return text;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger reflow to apply initial styles
        toast.offsetHeight;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    function renderMeals() {
        const mealsContainer = document.querySelector('.meals');
        mealsContainer.innerHTML = '';

        Object.entries(meals).forEach(([mealName, meal]) => {
            const mealCard = document.createElement('div');
            mealCard.className = 'meal-card';
            mealCard.innerHTML = `
                <h3>${mealName}</h3>
                <p>${meal.description}</p>
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
    // Initialize the app
    renderMeals();

    // Add copy orders functionality
    const copyBtn = document.getElementById('copy-orders');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (Object.keys(orders).length === 0) {
                showToast('No orders to copy');
                return;
            }
            
            const formattedOrders = formatOrdersForCopy();
            navigator.clipboard.writeText(formattedOrders)
                .then(() => showToast('Orders copied to clipboard!'))
                .catch(err => {
                    console.error('Failed to copy orders:', err);
                    showToast('Failed to copy orders');
                });
        });
    }
});
