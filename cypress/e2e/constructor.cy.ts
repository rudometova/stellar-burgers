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
  });
  
  afterEach(() => {
    // Очищаем токены после теста
    cy.clearCookies();
    window.localStorage.removeItem('refreshToken');
  });
  
  describe('Добавление ингредиентов в конструктор', () => {
    it('добавление булки', () => {
      cy.get('button').contains('Добавить').first().click();
      cy.contains('(верх)').should('exist');
    });
    
    it('добавление начинки', () => {
      cy.get('button').contains('Добавить').first().click();
      cy.get('button').contains('Добавить').then(($buttons) => {
        if ($buttons.length > 1) cy.wrap($buttons[1]).click();
      });
      cy.get('ul').find('li').should('have.length.at.least', 1);
    });
  });
  
  describe('Модальное окно ингредиента', () => {
    it('показ деталей ингредиента, закрытие окна', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.url().should('include', '/ingredients/');
      cy.go('back');
    });
  });
  
  describe('Окно заказа', () => {
    it('создание заказа, показ его номера', () => {
      // Добавляем ингредиенты
      cy.get('button').contains('Добавить').first().click();
      cy.get('button').contains('Добавить').then(($buttons) => {
        if ($buttons.length > 1) cy.wrap($buttons[1]).click();
      });
      
      // Оформляем заказ
      cy.get('button').contains('Оформить заказ').click();
      cy.wait('@createOrder');
      
      // Проверяем номер заказа - главное требование!
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
      
      cy.get('button').contains('Добавить').first().click();
      cy.get('button').contains('Оформить заказ').click();
      cy.url().should('include', '/login');
    });
  });
});