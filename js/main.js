//populate dropdown menu for program type select
function get_program_type(){

    var getSearch = $.ajax({
        url: "https://ontariotechu.ca/programs/index.json",
        type: "GET",
        dataType: "json"
    });

    getSearch.done(function (data) {

        var content = "<option value=>Select a program type</option>";
        var program_list = data.programs.program;
        var result = [];

        for(let i=0;i<program_list.length; i++){
            var typeArray = program_list[i].program_type;
            for(let j=0; j<typeArray.length; j++){
                // console.log(theFaculty);
                if(!result.includes(typeArray[j])){
                    result.push(typeArray[j]);
                }
            }
        }

        // console.log(result);

        $.each(result, function (i, item) {
            content += `
                        <option value="${item}">${item}</option>
            `;
        });
        $("#degreeFilter").html(content);
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
    
}

//populate dropdown menu for faculty select
function get_faculty_dropdown(search_text){


    var getSearch = $.ajax({
        url: "https://ontariotechu.ca/programs/index.json",
        type: "GET",
        dataType: "json"
    });

    getSearch.done(function (data) {

        var content = "<option value=>Select a faculty</option>";
        var program_list = data.programs.program;
        var result = [];

        for(let i=0;i<program_list.length; i++){
            var typeArray = program_list[i].program_type;
            for(let j=0; j<typeArray.length; j++){
                if(typeArray[j].includes(search_text)){
                    var theFaculty = program_list[i].faculty;
                    // console.log(theFaculty);
                    if(!result.includes(theFaculty)){
                        result.push(theFaculty);
                    }
                    break;
                }
            }
        }

        // console.log(result);

        $.each(result, function (i, item) {
            content += `
                        <option value="${item}">${item}</option>
            `;
        });
        $("#facultyFilter").html(content);
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
};


//populate program menu for program select
function get_program_dropdown(programType, faculty){

    var getSearch = $.ajax({
        url: "https://ontariotechu.ca/programs/index.json",
        type: "GET",
        dataType: "json"
    });

    getSearch.done(function (data) {

        var content = "<option value=>Select a program</option>";
        var program_list = data.programs.program;
        var result = [];

        for(let i=0;i<program_list.length; i++){
            var typeArray = program_list[i].program_type;
            for(let j=0; j<typeArray.length; j++){
                if(typeArray[j].includes(programType)){
                    var theFaculty = program_list[i].faculty;

                    if(theFaculty.includes(faculty)){
                        result.push(program_list[i]);
                        console.log(result);
                    }
                    break;
                }
            }
        }

        // console.log(result);

        $.each(result, function (i, item) {
            content += `
                        <option value="${item.title}" data-id="${item.link}">${item.title}</option>
            `;
        });
        $("#programFilter").html(content);
        // $('#viewProgram').attr('href', 'https://ontariotechu.ca/programs/${item.link}')
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
};


//search the programs and display the results
function get_program(search_text){
    search_text = search_text.toUpperCase();
    
    var getSearch = $.ajax({
        url: "https://ontariotechu.ca/programs/index.json",
        type: "GET",
        dataType: "json"
    });

    getSearch.done(function (data) {

        var content = "";
        var program_list = data.programs.program;
        var result = program_list.filter(program => program.title.toUpperCase().includes(search_text));
        $.each(result, function (i, item) {
            content += `<article>
                            <ul>
                                <li class="program-title"><a href='https://ontariotechu.ca/programs/${item.link}'>${item.title}</a></li>
                                <li class="program-faculty">${item.faculty}</li>
                                <li class="program-type">${item.program_type}</li>
                                <li class="program-summary">${item.summary}</li>
                            </ul>
                        </article>
            `;
        });
        $("#resultWrapper").html(content);
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
}

//search form submit
$("#searchProgramForm").on('submit', function (e) {
    e.preventDefault();
    $('.program-list').hide();
    var theProgram = $('#inputContent').val();
    get_program(theProgram);
})

//display the predictive text when enter search text 
function get_search(search_text) {

    search_text = search_text.toUpperCase();
    
    var getSearch = $.ajax({
        url: "https://ontariotechu.ca/programs/index.json",
        type: "GET",
        dataType: "json"
    });

    getSearch.done(function (data) {
        var content = "";
        var program_list = data.programs.program;
        var result = program_list.filter(program => program.title.toUpperCase().includes(search_text));
        $.each(result, function (i, item) {
            content += `<li class="program-title">${item.title}</li>`;
        });
        $(".found>td>ul").html(content);
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });
}

$(document).ready(
    function () {
        console.log('hi');
        // display the search list event when keyup
        $('#inputContent').keyup(
            function(){
                var search_text = $(this).val();
                get_search(search_text);
                $(".found").css("overflow","scroll");
                $('.program-list').show();
                if($(this).val() == ''){
                    $('.fas.remove').hide();
                }else {
                    $('.fas.remove').show();
                }
                $('.found ul').show();

            }
        );

        //file the search event when click on the program list
        $(document).on('click','.program-title',function(){
            var programTitle = $(this).text();
            $('#inputContent').val(programTitle);
            $('#searchProgramForm').submit();
            $('.fas.remove').show();
        })

        //remove the text in the input 
        $(document).on('click','.remove',function(){
            $('#inputContent').val('');
            $(this).hide();
        })

        //populate the dropdown menu for program type
        get_program_type();

        //select from the program type dropdown
        $('#degreeFilter').change(function(){
            var programType = $(this).val();
            if(programType != ''){
                $('#facultyFilter').prop('disabled', false);
                $('#facultyFilter').focus();
                get_faculty_dropdown(programType);
            }else {
                $('.view-program').prop('disabled', true);
                $('#facultyFilter').prop('disabled', true);
            }
            
            $('#programFilter').val('');
            $('#facultyFilter').val('');
            $('#programFilter').prop('disabled', true);
        })

        //select from the faculty dropdown
        $('#facultyFilter').change(function(){
            var faculty = $(this).val();
            var programType = $('#degreeFilter').val();
            if(faculty != ''){
                console.log(faculty);
                $('#programFilter').prop('disabled', false);
                $('#programFilter').focus();
                get_program_dropdown(programType,faculty);
            }else {
                $('.view-program').prop('disabled', true);
                $('#programFilter').prop('disabled', true);
            }
            $('#programFilter').val('');
        })

         //select from the program dropdown
        $('#programFilter').change(function(){
            var program = $(this).val();
            console.log(program);
            var link= $(this).find(':selected').data('id');
            // console.log(link);
            if(program != ''){
                $('.view-program').prop('disabled', false);
                $('.view-program').attr('data-link', link);
                console.log(link);
            }
        })

        //click the view program button
        $('.button.view-program').click(function(){
            var link = $(this).attr('data-link');
            window.open(`https://ontariotechu.ca/programs/${link}`);
        })

    }
);