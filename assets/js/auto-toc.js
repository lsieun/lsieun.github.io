/*  Plugin: AutoToc.js
 *   Author: Asif Mughal
 *   URL: https://www.codehim.com
 *   License: MIT License
 *   Copyright (c) 2018 - Asif Mughal
 *
 *   USEAGE: This lite weight plug-in automatically generate "Table of Contents" of the article based on the h2 headings available in article tag. 
 * 
 * HOW TO USE: Just call the autoToc() in your jQuery code, use the HTML selector, where TOC to be inserted. For example, if you want to append table of contents in the beginning of your article, the statement will be:
      $("article").autoToc();

* Similarly, you can insert this autoToc anywhere, i.e in the sidebar , or your desired location. 
*/


(function ($) {
    $.fn.autoToc = function () {
        return this.each(function () {

            let totalNum = $("article h2").length; //Find the total number of h2 available in article
            if (totalNum === 0) return;

            let $autoToc = $("<div></div>"); //Create div for the table
            let $title = $("<h4></h4>").text("Table Of Contents"); //Text for heading
            let $ul = $("<ul></ul>"); //Create ordered list for contents

            let first_index = 0;
            let second_index = 0;
            let third_index = 0;

            $("article h2,h3,h4").each(function () {
                let h = $(this);
                let text = h.text();

                if (h.is("h2")) {
                    first_index += 1;
                    second_index = 0;
                    third_index = 0;
                    text = first_index + ". " + text;
                } else if (h.is("h3")) {
                    second_index += 1;
                    third_index = 0;
                    text = first_index + "." + second_index + ". " + text;
                }
                else if (h.is("h4")) {
                    third_index += 1;
                    text = first_index + "." + second_index + "." + third_index + ". " + text;
                }

                let head_id = h.attr("id");
                let anchor;
                // if (head_id != null) {
                //     anchor = head_id;
                // }
                // else {
                //     anchor = "mark_" + first_index + "_" + second_index + "_" + third_index;
                //     h.attr("id", anchor);
                // }
                // anchor = guid();
                anchor = "mark_" + first_index + "_" + second_index + "_" + third_index;
                h.attr("id", anchor);
                h.text(text);


                $li = $("<li></li>");
                $a = $("<a></a>").text(text).attr("href", "#" + anchor);
                $li.append($a);

                if (h.is("h3")) {
                    $li.css("margin-left", "2em");
                }
                else if (h.is("h4")) {
                    $li.css("margin-left", "4em");
                }

                $ul.append($li);
            })

            $autoToc.append($title); //Heading entered into the TOC div
            $autoToc.append($ul); //Unordered list entered into the TOC div
            $autoToc.insertBefore(this);
            $autoToc.addClass("auto-toc");
            $(this).parent().css("display", "block");
            // document.getElementById('toc_div').style.display='block';

            //Smooth Scroll between sections
            $("#toc_div .auto-toc a").on('click', function (e) {
                if (this.hash !== "") {
                    e.preventDefault();
                    let hash = this.hash;
                    let target = $(hash);
                    if (target.length === 0) {
                        return;
                    }
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top
                    }, 500, function () {
                        window.location.hash = hash;
                    });
                }
            });
        });
    };

}(jQuery));

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0;
        let v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
