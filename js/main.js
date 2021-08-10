
 //objeto principal que controla a aplicaçao
const Main = {

    tasks: [],

    // responsavel por iniciar 
    init: function(){
        // this se referencia ao main, informando que a funçao cacheSelector está no "pai" que é o main.
        this.cacheSelectors() 
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    // responsavel por selecionar os elementos do html e armazena-los em uma variavel
    cacheSelectors: function(){
        // o this nesse caso, coloca a variavel "checkButtons" no Main, deixando ela disponivel para todas outras funçoes
        this.$checkButtons = document.querySelectorAll(".check")
        //toda variavel que se tratar de um elemento HTML deve ter um cifrao na frente (boa prática)
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    // responsavel por add eventos nos elementos html selecionados acima
    bindEvents: function(){
        const self = this
        this.$checkButtons.forEach(function(button){
            button.onclick = self.Events.checkButton_click
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)
            //se usar o bind com o this, nao funcionará, pois o this nesse caso se refere ao escopo dessa funçao(forEach(function(button)). Por isso que tem que usar o self no bind, pois eh o this relacionado ao objeto e nao a funçao
        })
    },

    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')

        if (tasks) {
            this.tasks = JSON.parse(tasks)
        } else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }



        
        //this.tasks se refere ao 'tasks' em cima do init(escopo global)
        //o tasks se refere ao 'tasks' do getStoraged (escopo local)
        //o objetivo é pegar os itens do tasks local e armazenar no tasks global
    },

    getTaskHtml: function(task){
        return  `
            <li>
                <div class="check"></div>
                <label class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
        //o data-palavra(no caso task), coloca um parametro para a tag data, que torna possivel pegar o parametro no javascript através do dataset
    },

    buildTasks: function(){
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html

        this.cacheSelectors()
        this.bindEvents()
    },

    Events: {
        checkButton_click: function(e) {
            const li = e.target.parentElement
            const isDone = li.classList.contains('done')

            if (!isDone) {
                return li.classList.add('done') //o return interrompe a funçao, ele pode estar em qualquer lugar.
            }
            
            li.classList.remove('done')
        },
        
        // sempre que estivermos dentro de uma funçao de evento(qualquer que seja), o THIS irá se referenciar ao proprio elemento que voce adicionou o evento, ou seja, já nao é mais o nosso objeto
        inputTask_keypress: function(e){
            const key = e.key
            const value = e.target.value

            if (key === 'Enter') {
               this.$list.innerHTML += this.getTaskHtml(value)


               e.target.value = ''

               this.cacheSelectors()
               this.bindEvents()

               const savedTasks = localStorage.getItem('tasks')
               const savedTasksObj = JSON.parse(savedTasks)

               const obj = [
                   {task: value},
                   ...savedTasksObj
               ]

               localStorage.setItem('tasks', JSON.stringify(obj))
            }
        },

        removeButton_click: function(e) {
            const li = e.target.parentElement
            const value = e.target.dataset['task']

           

            const newTasksState = this.tasks.filter(item => item.task !== value)

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            console.log(newTasksState)

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)
        }
    }   

}

Main.init()