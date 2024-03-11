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

//データを受け取ったあとの最初の処理
function make(data){
    document.getElementById.innerHTML = data;
    data = JSON.parse(data);
    console.log("取得データ↓")
    console.log(data)

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
                create_button.setAttribute(onclick, "make_domain('"+ domain_name +"')")

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
                create_button.setAttribute(onclick, "make_file('"+ file_name +"')")

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
    //一度初期化
    document.getElementById("iferror_message").innerHTML = ""
    //親要素
    var contents_ul = document.getElementsByClassName("contents_ul")[0]
    var i = 0
    for(var content of data.bookmark.contents){
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

        //i を進める
        i++
    }
}

//指定したドメインに分類します
function make_domain(domain){
    console.log("make_domain :"+domain)
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
                return text
            });
        })
        .catch((error) => {
            alert(error.message);
        });
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
    }else{
        send("change_favolite",key,true);
        button.classList.add("content_like");
    }

}

function delete_content(num,key){
    alert(num+","+key);
}
