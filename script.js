let cart = [];
let stock = {
    "Hamburguer Duplo": 10,
    "Hamburguer Smash": 10,
    "Hamburguer Salad": 10,
    "Hamburguer da Casa": 10,
    "Coca lata": 10,
    "Guaraná lata": 10,
    "Fanta uva lata": 10,
    "Fanta laranja lata": 10
};

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const cartCountElement = document.getElementById("cart-count");
    const closeModalButton = document.getElementById("close-modal-btn");
    const checkoutButton = document.getElementById("checkout-btn");
    const addStockButton = document.getElementById("add-stock-btn");
    const removeStockButton = document.getElementById("remove-stock-btn");
    const itemNameInput = document.getElementById("item-name");
    const itemStockInput = document.getElementById("item-stock");
    const addressInput = document.getElementById("address");
    const addressWarn = document.getElementById("address-warn");
    
    
    // Verificar a hora e manipular o card do horário
    function checkRestauranteOpen() {
        const data = new Date();
        const hora = data.getHours();
        return hora >= 8 && hora < 24; // True = restaurante está aberto
    }

    const spanItem = document.getElementById("date-span");
    const isOpen = checkRestauranteOpen();

    if (isOpen) {
        spanItem.classList.remove("bg-red-500");
        spanItem.classList.add("bg-green-600");
    } else {
        spanItem.classList.remove("bg-green-600");
        spanItem.classList.add("bg-red-500");
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item) => {
          total += item.price * item.quantity;
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('flex', 'justify-between', 'mb-2');
          itemDiv.innerHTML = `${item.name} - Quantidade: ${item.quantity} - R$ ${item.price.toFixed(2)} <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>`;
          cartItemsContainer.appendChild(itemDiv);
        });
        cartTotalElement.innerText = total.toFixed(2);
        cartCountElement.innerText = cart.length;
      }
      
      // Adiciona evento de click aos botões "Remover" do carrinho
      cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-from-cart-btn")) {
          const itemName = e.target.dataset.name;
          const itemIndex = cart.findIndex((item) => item.name === itemName);
          
          if (itemIndex !== -1) {
            const itemQuantity = cart[itemIndex].quantity;
            
            // Remove apenas um item por vez
            if (itemQuantity > 1) {
              cart[itemIndex].quantity -= 1;
            } else {
              cart.splice(itemIndex, 1);
            }
            
            
            
            updateCart();
            updateStockDisplay();
            
            Toastify({
              text: `${itemName} removido do carrinho!`,
              duration: 3000,
              gravity: "top",
              position: "center",
              backgroundColor: "green",
            }).showToast();
          }
        }
      });
      
      
      
      
  

   // Adiciona evento de click aos botões "Adicionar ao carrinho"
addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemName = button.dataset.name;
      const itemPrice = parseFloat(button.dataset.price);
  
      // Verifica se o item está fora de estoque
      if (stock[itemName] <= 0) {
        Toastify({
          text: `Não tem mais ${itemName} no estoque!`,
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }
  
      // Verifica se o item já está no carrinho
      const existingItem = cart.find((item) => item.name === itemName);
  
      if (existingItem) {
        // Se o item já está no carrinho, aumenta a quantidade
        if (existingItem.quantity < stock[itemName]) {
          existingItem.quantity += 1;
        } else {
          Toastify({
            text: `Limite máximo de ${itemName} alcançado!`,
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }
      } else {
        // Se o item não está no carrinho, adiciona-o
        if (stock[itemName] > 0) {
          cart.push({ name: itemName, price: itemPrice, quantity: 1 });
        } else {
          Toastify({
            text: `Não tem mais ${itemName} no estoque!`,
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }
      }
  
      updateCart();
      updateStockDisplay();
  
      Toastify({
        text: `${itemName} adicionado ao carrinho!`,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
    });
  });
  
  
  
  
  // Função para finalizar a compra
function finalizarCompra() {
    cart.forEach((item) => {
      const itemName = item.name;
      const itemQuantity = item.quantity;
  
      // Verifica se o item está no estoque e desconta a quantidade certa
      if (stock[itemName] !== undefined) {
        stock[itemName] -= itemQuantity;  
      }
    });
  
    // Limpa o carrinho após a compra
    cart = [];
    updateCart();
    updateStockDisplay();
  
    Toastify({
      text: "Pedido finalizado com sucesso!",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "blue",
    }).showToast();
  }
  
  
  
  
  

    document.getElementById("cart-btn").addEventListener("click", () => {
        cartModal.classList.remove("hidden");
        updateCart();
    });

    closeModalButton.addEventListener("click", () => {
        cartModal.classList.add("hidden");
    });

    addStockButton.addEventListener("click", () => {
        const itemName = itemNameInput.value.trim();
        const itemStock = parseInt(itemStockInput.value);

        if (itemName && !isNaN(itemStock) && itemStock > 0) {
            if (!stock[itemName]) {
                stock[itemName] = 0;
            }
            stock[itemName] += itemStock;
            Toastify({
                text: `Adicionado ${itemStock} unidades de ${itemName} ao estoque!`,
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'green',
            }).showToast();
            itemNameInput.value = '';
            itemStockInput.value = '';
            updateStockDisplay(); // Atualiza a exibição do estoque
        } else {
            Toastify({
                text: 'Por favor, preencha o nome do item e a quantidade!',
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'red',
            }).showToast();
        }
    });

    removeStockButton.addEventListener("click", () => {
        const itemName = itemNameInput.value.trim();
        const itemStock = parseInt(itemStockInput.value);

        if (itemName && !isNaN(itemStock) && itemStock > 0) {
            if (stock[itemName] && stock[itemName] >= itemStock) {
                stock[itemName] -= itemStock;
                Toastify({
                    text: `Removido ${itemStock} unidades de ${itemName} do estoque!`,
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'green',
                }).showToast();
                updateStockDisplay(); // Atualiza a exibição do estoque
            } else {
                Toastify({
                    text: `Não há estoque suficiente de ${itemName}!`,
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'red',
                }).showToast();
            }
            itemNameInput.value = '';
            itemStockInput.value = '';
        } else {
            Toastify({
                text: 'Por favor, preencha o nome do item e a quantidade!',
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'red',
            }).showToast();
        }
    });

    checkoutButton.addEventListener("click", () => {
        const isOpen = checkRestauranteOpen();
        if (!isOpen) {
            Toastify({
                text: "Ops, a lanchonete está fechada!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "#ef4444",
                },
            }).showToast();
            return;
        }
    
        if (cart.length === 0) {
            Toastify({
                text: 'O carrinho está vazio!',
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'red',
            }).showToast();
            return;
        }
    
        if (addressInput.value.trim() === "") {
            addressWarn.classList.remove("hidden");
        } else {
            addressWarn.classList.add("hidden");
            
            // Atualiza o estoque ao finalizar a compra
            cart.forEach(item => {
                if (stock[item.name]) {
                    stock[item.name] -= item.quantity; 
                }
            });
    
            // Criar um objeto para armazenar as quantidades de cada item e o total
            const itemQuantities = {};
            cart.forEach(item => {
                itemQuantities[item.name] = (itemQuantities[item.name] || 0) + item.quantity;
            });
    
            // Gera uma string para os itens do pedido, incluindo o preço total
            const cartItems = Object.entries(itemQuantities).map(([name, quantity]) => {
                const item = cart.find(item => item.name === name);
                const itemPrice = item.price * quantity;
                return `${name} - Quantidade: ${quantity} - Preço: R$ ${itemPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }).join(" | ");
    
            // Calcula o total geral de todos os itens no carrinho
            const totalPrice = Object.entries(itemQuantities).reduce((total, [name, quantity]) => {
                const item = cart.find(item => item.name === name);
                return total + (item.price * quantity);
            }, 0);
    
            // Formata a mensagem com o total geral e o endereço
            const message = encodeURIComponent(`${cartItems} | Total: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | Endereço: ${addressInput.value}`);
            const phone = "65996083197";
    
            window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
            
            cart = []; // Limpa o carrinho após a finalização da compra
            updateCart(); // Atualiza a exibição do carrinho
            updateStockDisplay(); // Atualiza a exibição do estoque
            closeModalButton.click();
            Toastify({
                text: 'Pedido finalizado com sucesso!',
                duration: 3000,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'green',
            }).showToast();
        }
    });
    
    
    
    // Toggle para mostrar ou esconder o estoque
    const toggleStockButton = document.getElementById("toggle-stock-btn");
    const stockDisplay = document.getElementById("stock-display");

    toggleStockButton.addEventListener("click", () => {
        if (stockDisplay.classList.contains("hidden")) {
            stockDisplay.classList.remove("hidden");
            toggleStockButton.textContent = "Ocultar Estoque"; // Muda o texto do botão
        } else {
            stockDisplay.classList.add("hidden");
            toggleStockButton.textContent = "Mostrar Estoque"; // Muda o texto do botão
        }
    });

    // Atualiza a exibição do estoque
    updateStockDisplay();
});

// Função para atualizar a exibição do estoque
function updateStockDisplay() {
    const stockItemsContainer = document.getElementById("stock-items");
    stockItemsContainer.innerHTML = ''; // Limpa a exibição anterior
  
    for (const [itemName, quantity] of Object.entries(stock)) {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('flex', 'justify-between', 'mb-2');
  
      itemDiv.innerHTML = `${itemName} - ${quantity} unidade${quantity === 1 ? '' : 's'} disponível`;
  
      stockItemsContainer.appendChild(itemDiv);
    }
  }
  
  
  

document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Substitua estas credenciais pelo seu próprio método de autenticação
    const validUsername = '1234'; // Nome de usuário para testes
    const validPassword = '1234';   // Senha para testes

    if (username === validUsername && password === validPassword) {
        document.getElementById('login-area').classList.add('hidden');
        document.getElementById('stock-management').classList.remove('hidden');
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
});

// Adiciona um evento para abrir e fechar o container de login
document.getElementById("open-login-btn").addEventListener("click", () => {
    const loginArea = document.getElementById("login-area");
    const isHidden = loginArea.classList.contains("hidden");
    
    // Alterna a visibilidade da área de login
    if (isHidden) {
        loginArea.classList.remove("hidden"); // Mostra a área de login
    } else {
        loginArea.classList.add("hidden"); // Oculta a área de login
        // Limpa os campos de login e senha
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
});

// Adiciona um evento para fechar a seção de gerenciamento de estoque
document.getElementById("close-stock-btn").addEventListener("click", () => {
    document.getElementById("stock-management").classList.add("hidden"); // Oculta a seção de gerenciamento de estoque
});

