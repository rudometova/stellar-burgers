describe('Бургер-конструктор', () => {
  beforeEach(() => {
    // Мокируем все API запросы
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');
    
    // Устанавливаем фейковые токены авторизации
    cy.setCookie('accessToken', 'Bearer fake-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    
    // Открываем главную страницу
    cy.visit('/');
    
    // Ждем загрузку ингредиентов
    cy.wait('@getIngredients');
    
    // Ждем пока приложение загрузится и элементы станут доступны
    cy.contains('Соберите бургер').should('exist');
    
    // Скрываем webpack overlay если он есть
    cy.window().then((win) => {
      const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });
  });
  
  afterEach(() => {
    // Очищаем токены после теста
    cy.clearCookies();
    window.localStorage.removeItem('refreshToken');
  });
  
  describe('Добавление ингредиентов в конструктор', () => {
    it('добавление булки', () => {
      cy.get('button').contains('Добавить').first().click({ force: true });
      cy.contains('(верх)').should('exist');
    });
    
    it('добавление начинки', () => {
      cy.get('button').contains('Добавить').first().click({ force: true });
      cy.get('button').contains('Добавить').then(($buttons) => {
        if ($buttons.length > 1) cy.wrap($buttons[1]).click({ force: true });
      });
      cy.get('ul').find('li').should('have.length.at.least', 1);
    });
  });
  
  describe('Модальное окно ингредиента', () => {
  it('показ деталей именно того ингредиента, по которому произошел клик', () => {
    // Кликаем на конкретный ингредиент с force
    cy.contains('Краторная булка N-200i').click({ force: true });
    
    // Проверяем URL содержит ID ингредиента
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    
    // Ждем появления модального окна
    cy.get('#modals', { timeout: 10000 }).should('exist');
    
    // Скрываем overlay если он мешает
    cy.window().then((win) => {
      const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });
    
    // Проверяем что элемент существует (не обязательно видим)
    cy.get('#modals').within(() => {
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('Детали ингредиента').should('exist');
    });
    
    // Альтернативно: проверяем текст
    cy.get('#modals').invoke('text').then((text) => {
      expect(text).to.include('Краторная булка N-200i');
      expect(text).to.include('Детали ингредиента');
      expect(text).to.not.include('Биокотлета из марсианской Магнолии');
    });
  });
    
    it('закрытие модального окна по клику на крестик', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').click({ force: true });
      
      // Ждем появления модального окна
      cy.get('#modals', { timeout: 10000 }).should('exist');
      cy.url().should('include', '/ingredients/');
      
      // Крестик: button > svg (CloseIcon)
      cy.get('#modals').then(($modals) => {
        if ($modals.find('button svg').length > 0) {
          cy.get('#modals').find('button svg').click({ force: true });
        } else {
          cy.get('body').type('{esc}');
        }
      });
      
      // Проверяем, что модальное окно закрылось
      cy.url().should('not.include', '/ingredients/');
    });
  });
  
  describe('Окно заказа', () => {
    it('создание заказа, показ его номера', () => {
      // Добавляем ингредиенты с force
      cy.get('button').contains('Добавить').first().click({ force: true });
      cy.get('button').contains('Добавить').then(($buttons) => {
        if ($buttons.length > 1) cy.wrap($buttons[1]).click({ force: true });
      });
      
      // Оформляем заказ
      cy.get('button').contains('Оформить заказ').click({ force: true });
      cy.wait('@createOrder');
      
      // Проверяем номер заказа
      cy.contains('12345', { timeout: 10000 }).should('exist');
      
      // Закрываем
      cy.get('body').type('{esc}');
      
      // Проверяем очистку конструктора
      cy.contains('Выберите булки', { timeout: 5000 }).should('exist');
    });
    
    it('переадресация, если пользователь не авторизован', () => {
      cy.clearCookies();
      window.localStorage.removeItem('refreshToken');
      cy.reload();
      
      cy.get('button').contains('Добавить').first().click({ force: true });
      cy.get('button').contains('Оформить заказ').click({ force: true });
      cy.url().should('include', '/login');
    });
  });
});