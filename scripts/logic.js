

function loadMacros() {
    $.ajax(
        {
            url: './rando_files/macros.txt',
            success: function (data) {
                var doc = jsyaml.load(data);
                console.log(doc);
            }
        }
    )
}

loadMacros();
