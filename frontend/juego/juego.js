class ElPostrino {
            constructor() {
                this.score = 0;
                this.level = 1;
                this.completedOrders = 0;
                this.streak = 0;
                this.maxStreak = 0;
                this.timeLeft = 60;
                this.gameActive = false;
                this.currentOrder = null;
                this.currentDessert = [];
                
                this.ingredients = [
                    'Bizcocho de Vainilla', 'Bizcocho de Chocolate', 'Bizcocho Red Velvet',
                    'Crema Chantilly', 'Crema de Chocolate', 'Crema de Fresa',
                    'Mermelada de Fresa', 'Dulce de Leche', 'Nutella',
                    'Fresas Frescas', 'Bananas', 'Arándanos',
                    'Chocolate Rallado', 'Coco Rallado', 'Almendras',
                    'Cerezas', 'Galletas Oreo', 'Caramelo Líquido'
                ];

                this.orderTypes = [
                    'Torta Clásica', 'Parfait', 'Tarta', 'Cupcake', 'Tiramisu'
                ];

                this.initializeGame();
                this.bindEvents();
                this.loadLeaderboard();
            }

            initializeGame() {
                this.createIngredientsGrid();
                this.updateDisplay();
            }

            bindEvents() {
                document.getElementById('newOrderBtn').addEventListener('click', () => this.generateNewOrder());
                document.getElementById('skipOrderBtn').addEventListener('click', () => this.skipOrder());
                document.getElementById('completeOrderBtn').addEventListener('click', () => this.completeOrder());
                document.getElementById('clearBuilderBtn').addEventListener('click', () => this.clearBuilder());
                document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
            }

            createIngredientsGrid() {
                const grid = document.getElementById('ingredientsGrid');
                grid.innerHTML = '';
                
                this.ingredients.forEach(ingredient => {
                    const btn = document.createElement('button');
                    btn.className = 'ingredient';
                    btn.textContent = ingredient;
                    btn.addEventListener('click', () => this.addIngredient(ingredient));
                    grid.appendChild(btn);
                });
            }

            generateNewOrder() {
                if (!this.gameActive) {
                    this.startGame();
                }

                const orderType = this.orderTypes[Math.floor(Math.random() * this.orderTypes.length)];
                const numIngredients = Math.min(3 + Math.floor(this.level / 2), 8);
                const requiredIngredients = [];

                // Seleccionar ingredientes aleatoriamente
                const shuffledIngredients = [...this.ingredients].sort(() => 0.5 - Math.random());
                for (let i = 0; i < numIngredients; i++) {
                    requiredIngredients.push(shuffledIngredients[i]);
                }

                this.currentOrder = {
                    type: orderType,
                    ingredients: requiredIngredients,
                    points: numIngredients * 10 + (this.level * 5)
                };

                this.displayCurrentOrder();
                this.showNotification(`¡Nuevo pedido de ${orderType}!`, 'success');
            }

            displayCurrentOrder() {
                const orderDisplay = document.getElementById('currentOrder');
                if (!this.currentOrder) return;

                let html = `
                    <div class="order-item">
                        <strong>🍰 ${this.currentOrder.type}</strong>
                        <div style="margin-top: 10px;">
                            <strong>Ingredientes requeridos:</strong>
                        </div>
                `;

                this.currentOrder.ingredients.forEach(ingredient => {
                    html += `<div style="margin: 5px 0; padding: 5px; background: rgba(116, 185, 255, 0.2); border-radius: 5px;">• ${ingredient}</div>`;
                });

                html += `<div style="margin-top: 10px; font-weight: bold; color: #60280c;">💰 Puntos: ${this.currentOrder.points}</div>`;
                html += `</div>`;

                orderDisplay.innerHTML = html;
            }

            addIngredient(ingredient) {
                if (!this.gameActive) {
                    this.showNotification('¡Presiona "Nuevo Pedido" para comenzar!', 'error');
                    return;
                }

                this.currentDessert.push(ingredient);
                this.updateDessertBuilder();
                
                // Efecto visual en el botón
                const buttons = document.querySelectorAll('.ingredient');
                buttons.forEach(btn => {
                    if (btn.textContent === ingredient) {
                        btn.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            btn.style.transform = '';
                        }, 150);
                    }
                });
            }

            updateDessertBuilder() {
                const builder = document.getElementById('dessertBuilder');
                if (this.currentDessert.length === 0) {
                    builder.innerHTML = `
                        <div style="text-align: center; color: white; font-size: 1.2em; margin-top: 50px;">
                            Selecciona ingredientes para armar tu postre
                        </div>
                    `;
                    return;
                }

                let html = '<div style="color: #60280c; font-weight: bold; margin-bottom: 10px;">🍰 Tu Postre:</div>';
                
                this.currentDessert.forEach((ingredient, index) => {
                    html += `
                        <div class="dessert-layer">
                            ${index + 1}. ${ingredient}
                        </div>
                    `;
                });

                builder.innerHTML = html;
            }

            completeOrder() {
                if (!this.currentOrder || !this.gameActive) {
                    this.showNotification('¡No hay pedido activo!', 'error');
                    return;
                }

                if (this.currentDessert.length === 0) {
                    this.showNotification('¡Tu postre está vacío!', 'error');
                    return;
                }

                // Verificar si el pedido coincide exactamente
                const isExactMatch = this.arraysEqual(
                    this.currentOrder.ingredients.sort(),
                    this.currentDessert.sort()
                );

                if (isExactMatch) {
                    // Pedido perfecto
                    this.score += this.currentOrder.points + (this.streak * 5);
                    this.completedOrders++;
                    this.streak++;
                    this.maxStreak = Math.max(this.maxStreak, this.streak);
                    this.showNotification(`¡Perfecto! +${this.currentOrder.points + (this.streak * 5)} puntos`, 'success');
                } else {
                    // Verificar ingredientes correctos
                    const correctIngredients = this.currentDessert.filter(ing => 
                        this.currentOrder.ingredients.includes(ing)
                    ).length;
                    
                    const accuracy = correctIngredients / this.currentOrder.ingredients.length;
                    
                    if (accuracy >= 0.7) {
                        // Pedido parcialmente correcto
                        const points = Math.floor(this.currentOrder.points * accuracy);
                        this.score += points;
                        this.completedOrders++;
                        this.streak = Math.floor(this.streak / 2); // Reducir racha
                        this.showNotification(`¡Bien! +${points} puntos (${Math.floor(accuracy * 100)}% correcto)`, 'success');
                    } else {
                        // Pedido incorrecto
                        this.streak = 0;
                        this.showNotification(`¡Incorrecto! Solo ${Math.floor(accuracy * 100)}% correcto`, 'error');
                    }
                }

                // Limpiar y preparar para el siguiente pedido
                this.currentOrder = null;
                this.currentDessert = [];
                this.updateDessertBuilder();
                
                // Aumentar nivel cada 5 pedidos
                if (this.completedOrders % 5 === 0) {
                    this.level++;
                    this.showNotification(`¡Nivel ${this.level} desbloqueado!`, 'success');
                }

                this.updateDisplay();
                
                // Limpiar la pantalla del pedido
                document.getElementById('currentOrder').innerHTML = 
                    '<div class="order-item">¡Presiona "Nuevo Pedido" para el siguiente!</div>';
            }

            skipOrder() {
                if (!this.currentOrder || !this.gameActive) {
                    this.showNotification('¡No hay pedido activo!', 'error');
                    return;
                }

                this.streak = 0; // Resetear racha
                this.currentOrder = null;
                this.currentDessert = [];
                this.updateDessertBuilder();
                this.updateDisplay();
                
                document.getElementById('currentOrder').innerHTML = 
                    '<div class="order-item">Pedido saltado. ¡Presiona "Nuevo Pedido"!</div>';
                
                this.showNotification('Pedido saltado', 'error');
            }

            clearBuilder() {
                this.currentDessert = [];
                this.updateDessertBuilder();
                this.showNotification('Postre limpiado', 'success');
            }

            arraysEqual(a, b) {
                return a.length === b.length && a.every((val, index) => val === b[index]);
            }

            startGame() {
                this.gameActive = true;
                this.startTimer();
            }

            startTimer() {
                const timerInterval = setInterval(() => {
                    this.timeLeft--;
                    this.updateTimerDisplay();
                    
                    if (this.timeLeft <= 0) {
                        clearInterval(timerInterval);
                        this.endGame();
                    }
                }, 1000);
            }

            updateTimerDisplay() {
                const timerElement = document.getElementById('timer');
                timerElement.textContent = `Tiempo: ${this.timeLeft}s`;
                
                if (this.timeLeft <= 10) {
                    timerElement.style.color = '#60280c';
                    timerElement.style.animation = 'pulse 0.5s infinite';
                } else {
                    timerElement.style.color = '#60280c';
                    timerElement.style.animation = 'pulse 1s infinite';
                }
            }

            endGame() {
                this.gameActive = false;
                this.saveScore();
                this.showGameOverModal();
            }

            showGameOverModal() {
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('finalOrders').textContent = this.completedOrders;
                document.getElementById('finalStreak').textContent = this.maxStreak;
                
                const modal = document.getElementById('gameOverModal');
                modal.classList.add('show');
            }

            restartGame() {
                // Resetear todas las variables
                this.score = 0;
                this.level = 1;
                this.completedOrders = 0;
                this.streak = 0;
                this.maxStreak = 0;
                this.timeLeft = 60;
                this.gameActive = false;
                this.currentOrder = null;
                this.currentDessert = [];
                
                // Cerrar modal
                document.getElementById('gameOverModal').classList.remove('show');
                
                // Actualizar display
                this.updateDisplay();
                this.updateDessertBuilder();
                document.getElementById('currentOrder').innerHTML = 
                    '<div class="order-item">¡Presiona "Nuevo Pedido" para comenzar!</div>';
                
                // Resetear timer
                document.getElementById('timer').textContent = 'Tiempo: 60s';
                document.getElementById('timer').style.color = '#60280c';
                document.getElementById('timer').style.animation = 'pulse 1s infinite';
                
                this.showNotification('¡Nuevo juego iniciado!', 'success');
            }

            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('level').textContent = this.level;
                document.getElementById('completed').textContent = this.completedOrders;
                document.getElementById('streak').textContent = this.streak;
            }

            saveScore() {
                const scores = JSON.parse(localStorage.getItem('elPostrinoBestScores')) || [];
                scores.push({
                    score: this.score,
                    orders: this.completedOrders,
                    level: this.level,
                    streak: this.maxStreak,
                    date: new Date().toLocaleDateString()
                });
                
                // Mantener solo los 5 mejores
                scores.sort((a, b) => b.score - a.score);
                scores.splice(5);
                
                localStorage.setItem('elPostrinoBestScores', JSON.stringify(scores));
                this.loadLeaderboard();
            }

            loadLeaderboard() {
                try {
                    const scores = JSON.parse(localStorage.getItem('elPostrinoBestScores')) || [];
                    const leaderboardList = document.getElementById('leaderboardList');
                    
                    if (scores.length === 0) {
                        leaderboardList.innerHTML = '<div style="text-align: center; color: #666;">¡Aún no hay puntuaciones!</div>';
                        return;
                    }
                    
                    leaderboardList.innerHTML = scores.map((score, index) => `
                        <div class="score-item">
                            <span>${index + 1}. ${score.score} pts - Nivel ${score.level}</span>
                            <span>${score.date}</span>
                        </div>
                    `).join('');
                } catch (error) {
                    // Si localStorage no está disponible, mostrar mensaje alternativo
                    document.getElementById('leaderboardList').innerHTML = 
                        '<div style="text-align: center; color: #666;">Puntuaciones no disponibles</div>';
                }
            }

            showNotification(message, type) {
                const notification = document.getElementById('notification');
                notification.textContent = message;
                notification.className = `notification ${type}`;
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
        }

        // Inicializar el juego cuando la página se carga
        document.addEventListener('DOMContentLoaded', () => {
            new ElPostrino();
        });