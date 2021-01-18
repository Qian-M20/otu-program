var sameDegreePrograms =[];

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
        alert("Something went Wrong! (getSearch)" +
            textStatus);
    });
    
}

//populate dropdown menu for faculty select
function get_faculty_dropdown(search_text){

    sameDegreePrograms =[];

    var getSearch = $.ajax({
        url: "https://ontariotechu.ca/programs/index.json",
        type: "GET",
        dataType: "json"
    });

    getSearch.done(function (data) {

        var content = "<option value=>Select a faculty</option>";
        var program_list = data.programs.program;
        var result = [];

        //search programs that meets the program type, push to sameDegreePrograms, filter the faculty lists that meet degree type 
        for(let i=0;i<program_list.length; i++){
            var typeArray = program_list[i].program_type;
            for(let j=0; j<typeArray.length; j++){
                if(typeArray[j].includes(search_text)){
                    var theFaculty = program_list[i].faculty;
                    // console.log(theFaculty);
                    if(!result.includes(theFaculty)){
                        result.push(theFaculty);
                    }
                    sameDegreePrograms.push(program_list[i]);
                    break;
                }
            }
        }

        // console.log(sameDegreePrograms);

        //display the results of faculty lists
        $.each(result, function (i, item) {
            content += `<option value="${item}">${item}</option>`;
        });
        $("#facultyFilter").html(content);
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getSearch)" +
            textStatus);
    });
};


//populate program menu for program select
function get_program_dropdown(faculty){

    var getSearch = $.ajax({
        url: "https://ontariotechu.ca/programs/index.json",
        type: "GET",
        dataType: "json"
    });

    getSearch.done(function (data) {

        var content = "<option value=>Select a program</option>";
        var program_list = data.programs.program;
        var result = [];

        // filter the programs under the faculty 
        for(let i=0; i<sameDegreePrograms.length; i++){
            // console.log(sameDegreePrograms);
            var theFaculty = sameDegreePrograms[i].faculty;

            if(theFaculty.includes(faculty)){
                result.push(sameDegreePrograms[i]);
                // console.log(result);
            }
        }


        //display the results of program lists
        $.each(result, function (i, item) {
            content += `<option value="${item.title}" data-id="${item.link}">${item.title}</option>`;
        });
        $("#programFilter").html(content);
        // $('#viewProgram').attr('href', 'https://ontariotechu.ca/programs/${item.link}')
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getSearch)" +
            textStatus);
    });
};


//search the programs and display the results
function get_program(search_text){
    var orginal_search_text = search_text;

    $("#resultWrapper").show();

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
        var numOfResults = result.length;
        content += `<div class="number-of-results">Found <span>${numOfResults} </span> results related to "${orginal_search_text}"</div>`
        $.each(result, function (i, item) {
            content += `<article>
                            <ul>
                                <li class="program-title"><a href='https://ontariotechu.ca/programs/${item.link}'><h5>${item.title}</h5></a></li>
                                <li class="program-summary">${item.summary}</li>
                            </ul>
                        </article>
            `;
        });
        $("#resultWrapper").html(content);
    });

    getSearch.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getSearch)" +
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
        alert("Something went Wrong! (getSearch)" +
            textStatus);
    });
}

$(document).ready(
    function () {
        // console.log('hi');

        /*********************** SEARCH PROGRAM SECTION ************************/

        // display the search list event when keyup
        $('#inputContent').keyup(
            function(){
                var search_text = $(this).val();
                get_search(search_text);
                $(".found").css("overflow","scroll");
                $('.program-list').show();
                if($(this).val() == ''){
                    $('.fas.remove').hide();
                    $('.program-list').hide();

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
            $('#resultWrapper').hide();
            $('.found ul').hide();

        })


        /*********************** PROGRAM FILTER SECTION ************************/
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
                $('#facultyFilter').prop('disabled', true);
            }
            
            $('#programFilter').val('');
            $('#facultyFilter').val('');
            $('#programFilter').prop('disabled', true);
            $('.view-program').prop('disabled', true);
        })

        //select from the faculty dropdown
        $('#facultyFilter').change(function(){
            var faculty = $(this).val();
            var programType = $('#degreeFilter').val();
            if(faculty != ''){
                // console.log(faculty);
                $('#programFilter').prop('disabled', false);
                $('#programFilter').focus();
                get_program_dropdown(faculty);
            }else {
                $('#programFilter').prop('disabled', true);
            }
            $('#programFilter').val('');
            $('.view-program').prop('disabled', true);
        })

         //select from the program dropdown
        $('#programFilter').change(function(){
            var program = $(this).val();
            // console.log(program);
            var link= $(this).find(':selected').data('id');
            // console.log(link);
            if(program != ''){
                $('.view-program').prop('disabled', false);
                $('.view-program').attr('data-link', link);
                $(this).blur();
                // console.log(link);
            }else {
                $('.view-program').prop('disabled', true);
            }
        })

        //click the view program button
        $('.button.view-program').click(function(){
            var link = $(this).attr('data-link');
            window.open(`https://ontariotechu.ca/programs/${link}`);
            $(this).blur();

        })

        //click the close button hide the emergency section
        $('.close-btn').click(function(){
            $('#emergencyMessageBar').hide();
        })

        //click the ham button
        $('.ham-menu').click(function(){
            $('.ham-menu .fa-bars').toggle();
            $('.ham-menu .fa-times').toggle();
            $('.mobile-dropdown').toggle();
        })

        $(window).on('resize',function(){
            if($(window).width()>=1024){
                $('.mobile-nav').hide();
                $('.desktop-nav').show();
                $('.mobile-dropdown').hide();
                $('.ham-menu .fa-bars').show();
                $('.ham-menu .fa-times').hide();
            }else{
                $('.desktop-nav').hide();
                $('.mobile-nav').show();

            }
            
        })

        //click the dropdown menu
        $('.dropdown-menu').hover(function(){
            $('.dropdown-menu').removeClass('active');
            $('.dropdown-content').hide();
            if($(this).hasClass('future-students')){
                $('.dropdown-content.future-students').css('display','flex');
            }else{
                $(this).find('.dropdown-content').show();
            }
            $(this).addClass('active');
            

        })

        $(document).on('click',function(e){
            if(!$(e.target).is('.dropdown-menu') && !$(e.target).is('.dropdown-content')){
                $('.dropdown-content').hide();
                $('.dropdown-menu').removeClass('active');

            }
        })

    }
);