define([
    'base/js/namespace',
    'base/js/events',
    'base/js/utils'
], function(Jupyter, events) {
    'use strict';

    // stage 1: grab relevant parameters in DiscoDiffusion after running.
    
    var history_path = 'history_box.txt'

    // execute python code in main.js
    var executePythonCode = function(code) {
        var kernel = Jupyter.notebook.kernel;
        kernel.execute(code);
    }

    // insert a jupyter notebook cell
    var insert_cell = function() {
        Jupyter.notebook.insert_cell_above('code').set_text(`# Hello World`);
        Jupyter.notebook.select_prev();
    }

    // create a html window for user settings
    var create_window = function() {
        var exwindow = $('<div/>').attr('id', 'my-extension-window').css({
        'position': 'fixed',
        'top': '50px',
        'left': '50px',
        'width': '300px',
        'height': '200px',
        'background-color': 'white',
        'border': '1px solid #ccc',
        'padding': '10px',
        'z-index': '1000'
    }).appendTo('body');
    
    }

    // grab parameters in Jupyter code before running
    var grab = function() {
        
    }

    // execute code in all cell
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

    // add jupyter toolbar button
    var extensionButton = function() {
        console.log()
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help' : "run code and save text prompt as history",
                'icon' : 'fa-paper-plane',
                'handler' : grab,
            }, 'grab user settings', 'My Extension')
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