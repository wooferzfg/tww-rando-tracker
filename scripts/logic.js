

function loadMacros() {
    $.ajax(
        {
            url: './rando_files/macros.txt',
            success: function (data) {
                var doc = jsyaml.load(text);
                console.log(doc);
            }
        }
    )
}

loadMacros();
