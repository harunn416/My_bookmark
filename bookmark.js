//let data = JSON.parse(document.getElementById("temp_data").innerHTML)

function get(){
    let user_input_data = JSON.parse(localStorage.getItem("user_input_data"));
    console.log(`user_input_data : ${user_input_data}`);
    if(user_input_data == null){
        document.getElementsByClassName("contents")[0].innerHTML = "<p style='font-size: 30px;'>ユーザー情報を設定してください</p><p style='font-size: 30px;'>詳細はページ下部</p>"
    }else{
        let data = {"method":"get_data","name":user_input_data.user_name, "pass":user_input_data.user_pass}; // 渡したいデータ（配列やオブジェクトでも可） method

        let options = {
            // 第1引数に送り先
            method: 'POST', // メソッド指定
            headers: { 'Content-Type': 'application/json' }, // jsonを指定
            body: JSON.stringify(data) // json形式に変換して添付
        }

        fetch('http://webkuma.starfree.jp/getdata.php', options)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // レスポンスが JSON 形式であることを期待
        })
        .then(data => {
            console.log("return : ");
            console.log(data);
            if(data.response == "success"){
                make_mastar_data(data);
            }else if(data.response == "error"){
                document.getElementsByClassName("contents")[0].innerHTML = "<p style='font-size: 30px;'>"+data.message+"</p>"
            }
            
        })
        .catch(error => console.error('Error:', error));
    }
}

function send(order,pa1,pa2){
    if(order == null || order == undefined || order == ""){return "error"};
    if(pa1==undefined){pa1 = ""};
    if(pa2==undefined){pa2 = ""};

    let user_input_data = "https://script.google.com/macros/s/AKfycbwe2DmJiuEYebL3xRnrENibQj_Plre93pW2wzuFa_2I6I-UJ5yJbg6I-OVc5Fz4JNqC1A/exec"
    fetch(user_input_data, {
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

function make_mastar_data(data){
    let json_data = JSON.parse(data.message.data);
    console.log(json_data);

    //domain_unique
    let domain_array = []
    for(content of json_data.bookmark.contents){
        domain_array.push(content.domain);
    }
    let domain_unique = [...new Set(domain_array)];
    console.log(domain_unique);

    //tag_unique
    let tag_array = []
    for(content of json_data.bookmark.contents){
        if(content.tag != null){
            for(tag of content.tag){
                tag_array.push(tag);
            }
        }
    }
    let tag_unique = [...new Set(tag_array)];
    console.log(tag_unique);

    make_side(domain_unique, tag_unique);

    json_data.bookmark.domain_unique = domain_unique;
    json_data.bookmark.tag_unique = tag_unique;
    console.log(json_data);

    make(json_data);
}

//データを受け取ったあとの最初の処理
function make(data){
    console.log("取得データ↓")
    console.log(data)

    //データを仮領域に格納
    document.getElementById("temp_data").innerHTML = JSON.stringify(data);


    make_contents(data)
}

function make_side(domain_unique,tag_unique){
    //doain
        //親要素
        for(let domain_name of domain_unique){
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
    //tag
        //親要素
        for(let tag_name of tag_unique){
            //button
                //要素作成
                let create_button = document.createElement("button");
                //要素に名前を入れる
                create_button.textContent = tag_name
                //class属性追加
                create_button.classList.add("side_button")
                //onclick 追加
                create_button.setAttribute("onclick", "make_tag('"+ tag_name +"')")

            //list
                //要素作成
                let create_tag = document.createElement("li");
                //class属性追加
                create_tag.classList.add("side_list")

            //親要素に追加
            create_tag.appendChild(create_button);
            tag_list.appendChild(create_tag);

            //fome extra にも追加
            $("#pulldown_list").append(`<option value="${tag_name}">${tag_name}</option>`)
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

        //tag
        let content_taglist = document.createElement("div");
        content_taglist.classList.add("content_tagli");
        if(content.tag){}

        //operator
        let operator = document.createElement("div");
        operator.classList.add("operator");
            //2024-5-19 bookmark editor に変更
            ////button change name
            //let change_name_button = document.createElement("button");
            //change_name_button.classList.add("content_change_name_button");
            //change_name_button.setAttribute("onclick",'make_change_name_input('+i+","+content.key+')')
            //change_name_button.innerHTML = "タイトル変更"

            //bookmark_editor
            let edit_button = document.createElement("button");
            edit_button.classList.add("content_appear_bm_edit_button");
            edit_button.setAttribute("onclick",'appear_bm_edit('+i+","+content.key+')')
            edit_button.innerHTML = "<span style='font-size: 14px;'>🖊️</span>edit"
            //button delete
            let delete_button = document.createElement("button");
            delete_button.classList.add("content_delete_button");
            delete_button.setAttribute("onclick",'delete_content('+i+","+content.key+')')
            delete_button.innerHTML = "delete"
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
        operator.appendChild(hidden_button);
        operator.appendChild(like_button);
        operator.appendChild(delete_button);
        operator.appendChild(edit_button);

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
        content_list.appendChild(operator);
        content_list.appendChild(content_link);

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

function make_tag(tag_name){
    delete_content_all()
    //get the data
    let data = JSON.parse(document.getElementById("temp_data").innerHTML);
    
    for(content of data.bookmark.contents){
        if(content.tag.includes(tag_name)){
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
    let input_username = document.getElementById("input_username").value;
    let input_pass = document.getElementById("input_pass").value;
    let input_pass_re = document.getElementById("input_pass_re").value;
    if(input_pass !== input_pass_re){
        alert("再確認パスワードが一致しません");
    }else if(input_username == ""){
        alert("ユーザーネームを入力してください");
    }else{
        let user_data_json = {
            "user_name": input_username,
            "user_pass": input_pass
        }
        localStorage.setItem("user_input_data",JSON.stringify(user_data_json));
        window.location.reload();
    }
    
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
        let data = JSON.parse(document.getElementById("temp_data").innerHTML)
        get_content_byKey(data.bookmark.contents,key).remove();
    }
}

function make_change_name_input(num,key){ //名前変更を出す。
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

function form_add_bookmark(){
    let url = document.getElementById("form_add_url").value;
    let title = document.getElementById("form_add_title").value;
    let like = document.getElementById("option_like").checked;
    let hidden = document.getElementById("option_hidden").checked;
    let tag_list = $("#pulldown_list").val();
    let new_tag = document.getElementById("form_add_tag").value;

    //もし new_tag があったら tag_list に値を追加
    if(new_tag != ""){tag_list.push(new_tag)}

    console.log("url:", url, " title:", title, " like:", like, " hidden:", hidden, " tag_list:", tag_list, " new_tag:", new_tag);

    let json = {
        title: title,
        like: like,
        hidden: hidden,
        tag_list: tag_list,
    }

    send("add_content", url, JSON.stringify(json));
}

function apparent_form_extra(){
    if(document.getElementById("form_extra").style.display=="none"){
        document.getElementById("form_extra").style.display = "flex"
        document.getElementById("option_separate_border").style.display = ""
        console.log(document.getElementById("pulldown_list").childElementCount);
        if(document.getElementById("pulldown_list").childElementCount != 0){
            make_select()
        }
    }else{
        document.getElementById("form_extra").style.display = "none";
        document.getElementById("option_separate_border").style.display = "none"
    }
}

function create_tag_pulldown_list(parent_element, class_name){
    let data = JSON.parse(document.getElementById("temp_data").innerHTML);
    let tag_unique = data.bookmark.tag_unique
    for(tag_name of tag_unique){
        let option = document.createElement("option")
        option.setAttribute("value",tag_name)
        option.innerHTML = tag_name

        if(class_name){option.classList.add(class_name)}

        parent_element.appendChild(option);
        $("#pulldown_list").append(`<option value="${tag_name}">${tag_name}</option>`)
    }
}

function make_select() { //プルダウンリストの作成
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

function each_bookmark_editer_disappeard(){
    document.getElementById("each_bookmark_editor").style.display = "none";
}

function appear_bm_edit(i,key){
    //編集画面表示
    document.getElementById("each_bookmark_editor").style.display = "";
    //編集したいデータをtempから取ってくる。
    let data = JSON.parse(document.getElementById("temp_data").innerHTML);
    let content = get_content_byKey(data.bookmark.contents, key)
    
    //編集画面に書く値を挿入
    document.getElementById("edit_bm_url").innerHTML = content.url
    document.getElementById("edit_before_bm_url").innerHTML = content.url
    document.getElementById("edit_bm_title").innerHTML = content.title
    document.getElementById("edit_before_bm_title").innerHTML = content.title
    if(content.like == "like"){
        document.getElementById("edit_bm_like").checked = true
    }else{
        document.getElementById("edit_bm_like").checked = false
    }
    if(content.hidden == "hidden"){
        document.getElementById("edit_bm_hidden").checked = true
    }else{
        document.getElementById("edit_bm_hidden").checked = false
    }
    
    
    //make_select()
}

//補助ツール
function get_content_byKey(contents,key){ //data is contents array
    for(content of contents){
        if(content.key == key){
            return content
        }
    }
    return null
}

function edit_bookmark_tempData_and_displayBookmark(json_edit ,display_key){ //表示されているデータも書き換える場合は、第二引数にディスプレイ番号を入力してください。
    json_edit = {}
    let data_bookmark = JSON.parse(document.getElementById("temp_data").innerHTML).bookmark
    //新しいタグ
    if(newTag in json_edit){
        data_bookmark.tag_unique.push(json_edit.newTag);
    }
    //
    console.log(display_key);
}
