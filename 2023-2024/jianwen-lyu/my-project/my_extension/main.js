define([
    'base/js/namespace',
    'base/js/events'
], function(Jupyter, events) {
    'use strict';
    
    var history_path = './history/history_box.txt'

    // insert a jupyter notebook cell
    var insert_cell = function() {
        Jupyter.notebook.insert_cell_above('code').set_text(`# Hello World`);
        Jupyter.notebook.select_prev();
    }

    // execute code in selected cell
    var execute_all = function() {
        // obtain all cells
        var cells = Jupyter.notebook.get_cells();
        // execute cells
        cells.forEach(function(cell) {
            if (cell.cell_type === 'code')
            {
                Jupyter.notebook.execute_cell(cell);
            }
        });
    }

    var execute_selected = function() {
        // obtain selected cell
        var cell = Jupyter.notebook.get_selected_cell();
        // obtain the variable value in the code
        var code = cell.get_text()
        // user regex to match the variable indicating user input (variable name may change)
        var regex = new RegExp('user_input' + '\\s*=\\s*(.+?)\\s*($|\\n)', 'm');
        var match = code.match(regex);
        if (match) 
        {
            // write text prompt to file
            var text_prompt = match[1];
            utils.promising_write_file(history_path, text_prompt).catch(function(error) {
                console.error('Error writing to history box:', error);
            });

        } 
        // execute cell
        if (cell && cell.cell_type === 'code')
        {
            Jupyter.notebook.execute_cell(cell);
        }
    }

    // add jupyter toolbar button
    var extensionButton = function() {
        console.log()
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help' : "add a cell",
                'icon' : 'fa-paper-plane',
                'handler' : execute_selected
            }, 'add_cell', 'My Extension')
        ])
    }

    // execute when user load jupyter notebook
    function load_ipython_extension() {
        if (Jupyter.notebook.get_cells().length === 1)
        {
            // insert_cell();
        }
        extensionButton();
    }

    // execute when user start jupyter notebook
    // events.on('app_initialized.NotebookApp', function() {
    // });
    
    // return module API
    return {
        load_ipython_extension: load_ipython_extension
    };
});