<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/styles.css" />
  </head>
  <body>
    <header>
      <div class="info-container">
          <h1>Kanban</h1>
      </div>
      <div>
        <button class="add-card" type="button" onclick="AbreAddCard();">Adicionar Cartão</button>
      </div>
      <form class="input-container" id="input-container">
        <div class="row">
          <div>
            <h2>#Adicionar Cartão</h2>
          </div>
          <div>
            <button class="close-card" type="button" onclick="fechaAddCard();">X</button>
          </div>
        </div>
        <div class="fields">
          <input id="title" placeholder="Título" /><br>
          <input id="description" placeholder="Descrição" />
        </div>
        <div>
          <button class="new-card" type="submit" id="submit-button">Criar</button>
        </div>
      </form>
    </header>

    <section class="column-container">
      <div class="task-column" id="card">
        <h3>Análise</h3>
        <hr class="custom-hr" />
        <div class="task-list"></div>
      </div>

      <div class="task-column" id="alinhamento">
        <h3>Alinhamento</h3>
        <hr class="custom-hr" />
        <div class="task-list"></div>
      </div>

      <div class="task-column" id="desenvolvimento">
        <h3>Desenvolvimento</h3>
        <hr class="custom-hr" />
        <div class="task-list"></div>
      </div>

      <div class="task-column" id="codereview">
        <h3>Code Review</h3>
        <hr class="custom-hr" />
        <div class="task-list"></div>
      </div>
    </section>

    <div class="error-container"></div>

    <script src="js/app.js"></script>
  </body>
</html>
