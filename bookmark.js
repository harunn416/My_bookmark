//deta JSON.parse(document.getElementById("temp_data").innerHTML)

function get(){
    var api_url = localStorage.getItem("api_url");
    console.log(`apiURL : ${api_url}`);
    if(api_url == null){
        document.getElementsByClassName("contents")[0].innerHTML = "<p style='font-size: 30px;'>apiを設定してください</p><p style='font-size: 30px;'>詳細はページ下部</p>"
    }else{
        fetch(api_url, {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: encodeURI(`order=get_json&parameter_1=&parameter_2=`)
        })
            .then((response) => {
                response.text().then((text) => {
                    make(text)
                });
            })
            .catch((error) => {
                alert(error.message + "  APIのURLを確認してください");
            });
    }   
}

function send(order,pa1,pa2){
    if(order == null || order == undefined || order == ""){return "error"};
    if(pa1==undefined){pa1 = ""};
    if(pa2==undefined){pa2 = ""};

    var api_url = "https://script.google.com/macros/s/AKfycbwe2DmJiuEYebL3xRnrENibQj_Plre93pW2wzuFa_2I6I-UJ5yJbg6I-OVc5Fz4JNqC1A/exec"
    fetch(api_url, {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: encodeURI(`order=${order}&parameter_1=${pa1}&parameter_2=${pa2}`)
    })
        .then((response) => {
            response.text().then((text) => {
                console.log(text)
            });
        })
        .catch((error) => {
            alert(error.message);
        });
}

//データを受け取ったあとの最初の処理
function make(data){
    document.getElementById.innerHTML = data;
    data = JSON.parse(data);
    console.log("取得データ↓")
    console.log(data)

    //データを仮領域に格納
    document.getElementById("temp_data").innerHTML = JSON.stringify(data);

    make_side(data);

    make_contents(data) 
}

function make_side(data){
    //doain
        //親要素
        var domain_list = document.getElementById("domain_list");
        for(var domain_name of data.bookmark.domain_unique){
            //button
                //要素作成
                var create_button = document.createElement("button");
                //要素に名前を入れる
                create_button.textContent = domain_name
                //class属性追加
                create_button.classList.add("side_button")
                //onclick 追加
                create_button.setAttribute("onclick", "make_domain('"+ domain_name +"')")
            //list
                //要素作成
                var create_domain = document.createElement("li");
                //class属性追加
                create_domain.classList.add("side_list")
            //親要素に追加
            create_domain.appendChild(create_button);
            domain_list.appendChild(create_domain);
        }
    //file
        //親要素
        var file_list = document.getElementById("file_list");
        for(var file_name of data.bookmark.file_unique){
            //button
                //要素作成
                var create_button = document.createElement("button");
                //要素に名前を入れる
                create_button.textContent = file_name
                //class属性追加
                create_button.classList.add("side_button")
                //onclick 追加
                create_button.setAttribute("onclick", "make_file('"+ file_name +"')")

            //list
                //要素作成
                var create_file = document.createElement("li");
                //class属性追加
                create_file.classList.add("side_list")

            //親要素に追加
            create_file.appendChild(create_button);
            file_list.appendChild(create_file);
        }
}

function make_contents(data){
    if(data == undefined){data = JSON.parse(document.getElementById("temp_data").innerHTML)};
    //一度初期化
    document.getElementById("iferror_message").innerHTML = ""
    delete_content_all()
    var i = 0
    for(content of data.bookmark.contents){
        make_content(content,i)
        i++
    }
}

function make_content(content){
    if((document.getElementById("hidden_checkbox").checked == false && content.hidden == "") || document.getElementById("hidden_checkbox").checked){ //非表示のものを表示しない
        //要素数からリスト番号を逆算　例): 要素数:0 リスト番号:0
        var i = document.getElementsByClassName("contents_ul")[0].childElementCount;
        //親要素
        var contents_ul = document.getElementsByClassName("contents_ul")[0]

        //list
        var content_list = document.createElement("li");
        content_list.classList.add("content");

        //title
        var content_title = document.createElement("div");
        content_title.classList.add("content_title");
        content_title.textContent = content.title

        //domain
        var content_domain = document.createElement("div");
        content_domain.classList.add("content_domain");
        content_domain.innerHTML = "domain: <span class='domain_name'>"+content.domain+"</span>"

        //url
        var content_url = document.createElement("div");
        content_url.classList.add("content_url");
        content_url.innerHTML = "url: <span class='url_name'>"+content.url+"</span>"

        //operator
        var operator = document.createElement("div");
        operator.classList.add("operator");
            //button change name
            var change_name_button = document.createElement("button");
            change_name_button.classList.add("content_change_name_button");
            change_name_button.setAttribute("onclick",'make_change_name_input('+i+","+content.key+')')
            change_name_button.innerHTML = "タイトル変更"
            //button delete
            var delete_button = document.createElement("button");
            delete_button.classList.add("content_delete_button");
            delete_button.setAttribute("onclick",'delete_content('+i+","+content.key+')')
            delete_button.innerHTML = "削除"
            //button like
            var like_button = document.createElement("button");
            like_button.classList.add("content_like_button");
            if(content.like == "like"){like_button.classList.add("content_like");}
            like_button.setAttribute("onclick",'change_like('+i+","+content.key+')')
            like_button.innerHTML = "♥"
            //button hidden
            var hidden_button = document.createElement("button");
            hidden_button.classList.add("content_hidden_button");
            if(content.hidden == "hidden"){hidden_button.classList.add("content_hidden");}
            hidden_button.setAttribute("onclick",'change_hidden('+i+","+content.key+')')
            hidden_button.innerHTML = "hidden"
        operator.appendChild(change_name_button);
        operator.appendChild(hidden_button);
        operator.appendChild(delete_button);
        operator.appendChild(like_button);

        //anker (a)
        var content_link = document.createElement("a");
        content_link.classList.add("content_link");
        content_link.setAttribute("href", content.url);
        content_link.setAttribute("target", "_blank");
        content_link.setAttribute("rel", "noreferrer noopener");

        //list に他要素を追加
        content_list.appendChild(content_title);
        content_list.appendChild(content_domain);
        content_list.appendChild(content_url);
        content_list.appendChild(content_link);
        content_list.appendChild(operator);

        //ul に list を追加
        contents_ul.appendChild(content_list)
    }
}

function delete_content_all(){
    var length = document.getElementsByClassName("content").length
    for(var i=0; i<length; i++){
        document.getElementsByClassName("content")[0].remove()
    }
}

//指定したドメインに分類します
function make_domain(domain){
    delete_content_all()
    //get the data
    var data = JSON.parse(document.getElementById("temp_data").innerHTML);
    
    for(content of data.bookmark.contents){
        if(content.domain == domain){
            make_content(content)
        }
    }
}

function make_like(){
    delete_content_all()
    //get the data
    var data = JSON.parse(document.getElementById("temp_data").innerHTML);
    
    for(content of data.bookmark.contents){
        if(content.like == "like"){
            make_content(content)
        }
    }
}

function make_file(file_name){
    delete_content_all()
    //get the data
    var data = JSON.parse(document.getElementById("temp_data").innerHTML);
    
    for(content of data.bookmark.contents){
        if(content.file.includes(file_name)){
            make_content(content)
        }
    }
}

function changeAPI(){
    if(document.getElementById("set_api").style.display=="none"){
        document.getElementById("set_api").style.display = ""
    }else{
        document.getElementById("set_api").style.display = "none"
    }
    
}

function setAPI(){
    var input = document.getElementById("type_api").value
    localStorage.setItem("api_url",input);
}

function change_like(num,key){
    var button = document.getElementsByClassName("content_like_button")[num]
    if(button.classList.contains("content_like")){
        send("change_favolite",key,false);
        button.classList.remove("content_like");
        //データ変更
        var data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).like = "";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }else{
        send("change_favolite",key,true);
        button.classList.add("content_like");
        //データ変更
        var data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).like = "like";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }
}

function change_hidden(num,key){
    var button = document.getElementsByClassName("content_hidden_button")[num]
    if(button.classList.contains("content_hidden")){
        send("change_hidden",key,false);
        button.classList.remove("content_hidden");
        //データ変更
        var data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).hidden = "";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }else{
        send("change_hidden",key,true);
        button.classList.add("content_hidden");
        //データ変更
        var data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).hidden = "hidden";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }
}

function delete_content(num,key){
    //要素の削除
    if(window.confirm("要素を削除します。\nよろしいですか？")){
        console.log(send("delete_content",key));
        document.getElementsByClassName("content")[num].remove()
    }
}

function make_change_name_input(num,key){
    if(document.getElementsByClassName("content")[num].getElementsByClassName("change_name_form").length == 0){
        //親要素
        var content = document.getElementsByClassName("content")[num];
        
        var change_name_fome_div = document.createElement("div");
        change_name_fome_div.classList.add("change_name_form");

        var name_and_button = document.createElement("div");
        name_and_button.innerHTML = "タイトルを変更";
            var button = document.createElement("button");
            button.innerHTML = "変更";
            button.setAttribute("onclick", 'change_name('+num+","+key+')');
        name_and_button.appendChild(button);

        var input = document.createElement("input");
        input.setAttribute("type","input");
        input.classList.add("change_name_input")
        input.value = document.getElementsByClassName("content_title")[num].innerHTML;
        
        change_name_fome_div.appendChild(name_and_button);
        change_name_fome_div.appendChild(input);

        content.appendChild(change_name_fome_div);
    }else{
        document.getElementsByClassName("content")[num].getElementsByClassName("change_name_form")[0].remove()
    }
}

function change_name(num,key){
    var value = document.getElementsByClassName("content")[num].getElementsByClassName("change_name_input")[0].value;
    if(window.confirm(`タイトルを\n「${value}」\nに変更します。よろしいですか？`)){
        //送信
        send("change_name",key,value);
        //表示タイトル変更
        document.getElementsByClassName("content_title")[num].innerHTML = value;
        //データ変更
        var data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).title = value;
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }
}

function get_content_byKey(contents,key){ //data is contents array
    for(content of contents){
        if(content.key == key){
            return content
        }
    }
    return null
}

function form_add_bookmark(){
    var input = document.getElementById("form_add_url").value;
    send("add_content",)
}
