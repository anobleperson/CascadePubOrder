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
        },
        'Custom Order': {
            type: 'custom',
            description: 'Special requests or custom meals',
            placeholder: 'E.g., Gluten-free pasta, No onions, Extra spicy...'
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
                if (meal.type === 'multi' || meal.type === 'custom') {
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
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        let modalContent = '';
        
        if (meal.type === 'custom') {
            // Custom order modal
            modalContent = `
                <div class="custom-order-modal">
                    <h3>${mealName}</h3>
                    <p>${meal.description}</p>
                    <textarea id="custom-order-text" placeholder="${meal.placeholder || 'Enter your custom order details...'}" rows="4"></textarea>
                    <div class="modal-buttons">
                        <button id="cancel-customization">Cancel</button>
                        <button id="add-to-order" class="primary">Add Custom Order</button>
                    </div>
                </div>
            `;
        } else {
            // Standard meal with variations
            let variationsHtml = '';
            if (meal.variations && meal.variations.length > 0) {
                meal.variations.forEach((variation, index) => {
                    variationsHtml += `
                        <div class="variation">
                            <label>${variation.name}:</label>
                            <select id="variation-${index}">
                                ${variation.options.map(option => 
                                    `<option value="${option}">${option}</option>`
                                ).join('')}
                            </select>
                        </div>`;
                });
            }
            
            modalContent = `
                <div class="meal-modal">
                    <h3>${mealName}</h3>
                    <p>${meal.description}</p>
                    ${variationsHtml}
                    <div class="modal-buttons">
                        <button id="cancel-customization">Cancel</button>
                        <button id="add-to-order" class="primary">Add to Order</button>
                    </div>
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                ${modalContent}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus the first input field
        const firstInput = modal.querySelector('textarea, select, input');
        if (firstInput) firstInput.focus();
        
        // Add event listeners
        modal.querySelector('#add-to-order').addEventListener('click', () => {
            if (meal.type === 'custom') {
                const customText = modal.querySelector('#custom-order-text').value.trim();
                if (customText) {
                    addOrder(`Custom Order: ${customText}`, { 
                        type: 'custom',
                        description: customText
                    });
                    modal.remove();
                } else {
                    alert('Please enter your custom order details');
                }
            } else {
                const variations = {};
                if (meal.variations) {
                    meal.variations.forEach((variation, index) => {
                        const element = modal.querySelector(`#variation-${index}`);
                        if (element) {
                            variations[variation.name] = element.value;
                        }
                    });
                }
                addOrder(mealName, meal, variations);
                modal.remove();
            }
        });
        
        modal.querySelector('#cancel-customization').addEventListener('click', () => {
            modal.remove();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
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
