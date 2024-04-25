//let deta JSON.parse(document.getElementById("temp_data").innerHTML)

function get(){
    let api_url = localStorage.getItem("api_url");
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

    let api_url = "https://script.google.com/macros/s/AKfycbwe2DmJiuEYebL3xRnrENibQj_Plre93pW2wzuFa_2I6I-UJ5yJbg6I-OVc5Fz4JNqC1A/exec"
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
        let domain_list = document.getElementById("domain_list");
        for(let domain_name of data.bookmark.domain_unique){
            //button
                //要素作成
                let create_button = document.createElement("button");
                //要素に名前を入れる
                create_button.textContent = domain_name
                //class属性追加
                create_button.classList.add("side_button")
                //onclick 追加
                create_button.setAttribute("onclick", "make_domain('"+ domain_name +"')")
            //list
                //要素作成
                let create_domain = document.createElement("li");
                //class属性追加
                create_domain.classList.add("side_list")
            //親要素に追加
            create_domain.appendChild(create_button);
            domain_list.appendChild(create_domain);
        }
    //file
        //親要素
        let file_list = document.getElementById("file_list");
        for(let file_name of data.bookmark.file_unique){
            //button
                //要素作成
                let create_button = document.createElement("button");
                //要素に名前を入れる
                create_button.textContent = file_name
                //class属性追加
                create_button.classList.add("side_button")
                //onclick 追加
                create_button.setAttribute("onclick", "make_file('"+ file_name +"')")

            //list
                //要素作成
                let create_file = document.createElement("li");
                //class属性追加
                create_file.classList.add("side_list")

            //親要素に追加
            create_file.appendChild(create_button);
            file_list.appendChild(create_file);

            //fome extra にも追加
            $("#pulldown_list").append(`<option value="${file_name}">${file_name}</option>`)
        }
}

function make_contents(data){
    if(data == undefined){data = JSON.parse(document.getElementById("temp_data").innerHTML)};
    //一度初期化
    document.getElementById("iferror_message").innerHTML = ""
    delete_content_all()
    let i = 0
    for(content of data.bookmark.contents){
        make_content(content,i)
        i++
    }
}

function make_content(content){
    if((document.getElementById("hidden_checkbox").checked == false && content.hidden == "") || document.getElementById("hidden_checkbox").checked){ //非表示のものを表示しない
        //要素数からリスト番号を逆算　例): 要素数:0 リスト番号:0
        let i = document.getElementsByClassName("contents_ul")[0].childElementCount;
        //親要素
        let contents_ul = document.getElementsByClassName("contents_ul")[0]

        //list
        let content_list = document.createElement("li");
        content_list.classList.add("content");

        //title
        let content_title = document.createElement("div");
        content_title.classList.add("content_title");
        content_title.textContent = content.title

        //domain
        let content_domain = document.createElement("div");
        content_domain.classList.add("content_domain");
        content_domain.innerHTML = "domain: <span class='domain_name'>"+content.domain+"</span>"

        //url
        let content_url = document.createElement("div");
        content_url.classList.add("content_url");
        content_url.innerHTML = "url: <span class='url_name'>"+content.url+"</span>"

        //operator
        let operator = document.createElement("div");
        operator.classList.add("operator");
            //button change name
            let change_name_button = document.createElement("button");
            change_name_button.classList.add("content_change_name_button");
            change_name_button.setAttribute("onclick",'make_change_name_input('+i+","+content.key+')')
            change_name_button.innerHTML = "タイトル変更"
            //button delete
            let delete_button = document.createElement("button");
            delete_button.classList.add("content_delete_button");
            delete_button.setAttribute("onclick",'delete_content('+i+","+content.key+')')
            delete_button.innerHTML = "削除"
            //button like
            let like_button = document.createElement("button");
            like_button.classList.add("content_like_button");
            if(content.like == "like"){like_button.classList.add("content_like");}
            like_button.setAttribute("onclick",'change_like('+i+","+content.key+')')
            like_button.innerHTML = "♥"
            //button hidden
            let hidden_button = document.createElement("button");
            hidden_button.classList.add("content_hidden_button");
            if(content.hidden == "hidden"){hidden_button.classList.add("content_hidden");}
            hidden_button.setAttribute("onclick",'change_hidden('+i+","+content.key+')')
            hidden_button.innerHTML = "hidden"
        operator.appendChild(change_name_button);
        operator.appendChild(hidden_button);
        operator.appendChild(delete_button);
        operator.appendChild(like_button);

        //anker (a)
        let content_link = document.createElement("a");
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
    let length = document.getElementsByClassName("content").length
    for(let i=0; i<length; i++){
        document.getElementsByClassName("content")[0].remove()
    }
}

//指定したドメインに分類します
function make_domain(domain){
    delete_content_all()
    //get the data
    let data = JSON.parse(document.getElementById("temp_data").innerHTML);
    
    for(content of data.bookmark.contents){
        if(content.domain == domain){
            make_content(content)
        }
    }
}

function make_like(){
    delete_content_all()
    //get the data
    let data = JSON.parse(document.getElementById("temp_data").innerHTML);
    
    for(content of data.bookmark.contents){
        if(content.like == "like"){
            make_content(content)
        }
    }
}

function make_file(file_name){
    delete_content_all()
    //get the data
    let data = JSON.parse(document.getElementById("temp_data").innerHTML);
    
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
    let input = document.getElementById("type_api").value
    localStorage.setItem("api_url",input);
}

function change_like(num,key){
    let button = document.getElementsByClassName("content_like_button")[num]
    if(button.classList.contains("content_like")){
        send("change_favolite",key,false);
        button.classList.remove("content_like");
        //データ変更
        let data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).like = "";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }else{
        send("change_favolite",key,true);
        button.classList.add("content_like");
        //データ変更
        let data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).like = "like";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }
}

function change_hidden(num,key){
    let button = document.getElementsByClassName("content_hidden_button")[num]
    if(button.classList.contains("content_hidden")){
        send("change_hidden",key,false);
        button.classList.remove("content_hidden");
        //データ変更
        let data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).hidden = "";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }else{
        send("change_hidden",key,true);
        button.classList.add("content_hidden");
        //データ変更
        let data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).hidden = "hidden";
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
    }
}

function delete_content(num,key){
    //要素の削除
    if(window.confirm("要素を削除します。\nよろしいですか？")){
        console.log(send("delete_content",key));
        document.getElementsByClassName("content")[num].remove();

        //tempdata から削除
        let deta = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(deta.bookmark.contents,key).remove();
    }
}

function make_change_name_input(num,key){
    if(document.getElementsByClassName("content")[num].getElementsByClassName("change_name_form").length == 0){
        //親要素
        let content = document.getElementsByClassName("content")[num];
        
        let change_name_fome_div = document.createElement("div");
        change_name_fome_div.classList.add("change_name_form");

        let name_and_button = document.createElement("div");
        name_and_button.innerHTML = "タイトルを変更";
            let button = document.createElement("button");
            button.innerHTML = "変更";
            button.setAttribute("onclick", 'change_name('+num+","+key+')');
        name_and_button.appendChild(button);

        let input = document.createElement("input");
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
    let value = document.getElementsByClassName("content")[num].getElementsByClassName("change_name_input")[0].value;
    if(window.confirm(`タイトルを\n「${value}」\nに変更します。よろしいですか？`)){
        //送信
        send("change_name",key,value);
        //表示タイトル変更
        document.getElementsByClassName("content_title")[num].innerHTML = value;
        //データ変更
        let data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).title = value;
        document.getElementById("temp_data").innerHTML = JSON.stringify(data);
        //タイトル変更div 削除
        document.getElementsByClassName("content")[num].getElementsByClassName("change_name_form")[0].remove()
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
    let url = document.getElementById("form_add_url").value;
    let title = document.getElementById("form_add_title").value;
    let like = document.getElementById("option_like").checked;
    let hidden = document.getElementById("option_hidden").checked;
    let file_list = $("#pulldown_list").val();
    let new_file = document.getElementById("form_add_file").value;

    //もし new_file があったら file_list に値を追加
    if(new_file != ""){file_list.push(new_file)}

    console.log("url:", url, " title:", title, " like:", like, " hidden:", hidden, " file_list:", file_list, " new_file:", new_file);

    let json = {
        title: title,
        like: like,
        hidden: hidden,
        file_list: file_list,
    }

    send("add_content", url, JSON.stringify(json));
}

function apparent_form_extra(){
    if(document.getElementById("form_extra").style.display=="none"){
        document.getElementById("form_extra").style.display = "flex"
        console.log(document.getElementById("pulldown_list").childElementCount);
        if(document.getElementById("pulldown_list").childElementCount != 0){
            make_select()
        }
    }else{
        document.getElementById("form_extra").style.display = "none";
    }
}

function create_file_pulldown_list(parent_element, class_name){
    let data = JSON.parse(document.getElementById("temp_data").innerHTML);
    let file_unique = data.bookmark.file_unique
    for(file_name of file_unique){
        let option = document.createElement("option")
        option.setAttribute("value",file_name)
        option.innerHTML = file_name

        if(class_name){option.classList.add(class_name)}

        parent_element.appendChild(option);
        $("#pulldown_list").append(`<option value="${file_name}">${file_name}</option>`)
    }
}

function make_select() {
    $('select').multipleSelect({
        width: 100,
        formatSelectAll: function make_select() {
            return 'すべて';
        },
        formatAllSelected: function make_select() {
            return '全て選択されています';
        }
    });
}
