(function(){
    //ajax分页插件
    function SelectPage(args){
        var $this$=this;
        //保存分页插件
        this.pageBox=args.pageNode;
        //保存目标内容区域
        this.insertBox=args.insertBox;
        //保存url
        this.pageUrl=args.pageUrl;
        //保存总页数
        this.totalPageSize=parseInt(this.pageBox.attr("data-total-page"));
        //保存分页列表盒子
        this.pageListBox=$(".pages-list",this.pageBox);
        //保存上下翻页按钮
        this.prevBtn=$(".prev-btn",this.pageBox);
        this.nextBtn=$(".next-btn",this.pageBox);
        //初始化分页列表
        this.initPageList(this.totalPageSize);
        //在pageBox添加click事件
        this.pageListBox.click(function(e){
            //如果总页数是小于等于5的,就直接发送请求，否则动态创建
            if(e.target.tagName=="A"&&!$(e.target).hasClass("selected")){
                var pageIndex=parseInt($(e.target).text());
                //前往指定页码
                $this$.gotoPage(pageIndex);
            };    
        });
    
        //设置计数器的值
        this.pageLoop=parseInt(this.pageBox.attr("data-current-page"));
        
        this.prevBtn.click(function(){
            if(!$(this).hasClass("no-disable")){
                $this$.pageLoop--;
                $this$.gotoPage($this$.pageLoop);
            };
        });
        this.nextBtn.click(function(){
            if(!$(this).hasClass("no-disable")){
                $this$.pageLoop++;
                $this$.gotoPage($this$.pageLoop);
            };
        });    
        //获取当前页和总页的em节点
        this.currentEmNode=$("i",this.pageBox).eq(0);
        this.totalEmNode=$("i",this.pageBox).eq(1).text(this.totalPageSize);
        
        /////////////////////////////////////////////////以下是添加跳到指定页的功能
        this.gotoInput=$(".goto-page input",this.pageBox).val($this$.pageBox.attr("data-current-page"));
        this.gotoBtn=$(".goto-page a",this.pageBox);
        
        this.gotoInput.keyup(function(){
            var curIndex=this.value;
            if(isNaN(curIndex)){//如果输入不是数就设置为当前页
                this.value=$this$.pageListBox.find(".selected").text();
            }else if(curIndex<1){
                this.value=1;
            }else if(curIndex>$this$.totalPageSize){
                this.value=$this$.totalPageSize;
            };
        });
        this.gotoBtn.click(function(){
            var gotoIndex=parseInt($this$.gotoInput.val()),
                pageSelectedIndex=parseInt($this$.pageListBox.find(".selected").text());
            if(gotoIndex!=pageSelectedIndex){
                $this$.gotoPage(gotoIndex);
            };
        });
        /////////////////////////////////////////////////以上是添加跳到指定页的功能
    
    };
    SelectPage.prototype={
        //发送页码
        sendPage:function(pageIndex){
            //alert(pageIndex);
            var _this=this;
            //发送页码
            $.post(this.pageUrl,{currentPage:pageIndex},function(ret){
                
                var htmlContent = "";
                var data = ret['items']; 
                for(var i=0;i<ret['items'].length;i++){
                    var pro = data[i];
                    htmlContent += "<tr><td>"+pro['title']+"</td><td>"+pro['message']+"</td><td><em>"+pro['points']+"</em></td><td><em>"+pro['fameValue']+"</em></td><td>"+pro['createDate']+"</td></tr>";
                }
                
                //数据返回成功，先清楚内容
                _this.insertBox.empty().html(htmlContent);    
            
            },"json");
        
        },
        gotoPage:function(pageIndex){
            var _this_=this;
            //如果总页数是小于等于5的就直接发送请求，否则发送请求的同时在动态创建分页
            if(_this_.totalPageSize<=5){
                _this_.sendPage(pageIndex);
                //切换相关样式
                _this_.changeStyle(pageIndex);
            }else{
                _this_.sendPage(pageIndex);
                //如果分页数大于5，就动态改变
                _this_.addNewPageList(pageIndex)
                //切换相关样式
                _this_.changeStyle(pageIndex);
            };
            //设置计数器的值
            this.pageLoop=pageIndex;
            //设置当前值
            this.pageBox.attr("data-current-page",pageIndex);
            //设置实时页数
            this.currentEmNode.text(pageIndex);
            //设置输入框的值
            this.gotoInput.val(pageIndex);
        },
        //重新创建分页列表
        addNewPageList:function(pageIndex){
            if(pageIndex<3){
                //添加分页列表
                this.addPageList(3,true,true);
            }else{
                //添加分页列表
                this.addPageList(3,true,true);
                //绘制区间
                this.addMinToMaxPage(pageIndex);
            };    
        },
        //绘制一个指定区间的分页
        addMinToMaxPage:function(pageIndex){
            //this.totalPageSize
            if(pageIndex==3){
                for(var i=3;i<6;i++){
                    this.pageListBox.append("<a href='javascript:void(0);'>"+(i+1)+"</a>");
                };
            }else if(pageIndex==4){
                for(var i=3;i<6;i++){
                    this.pageListBox.append("<a href='javascript:void(0);'>"+(i+1)+"</a>");
                };
            }else if(pageIndex==this.totalPageSize){
                var ma=pageIndex==this.totalPageSize?this.totalPageSize:pageIndex-1;
                for(var i=this.totalPageSize-3;i<ma;i++){
                    this.pageListBox.append("<a href='javascript:void(0);'>"+(i+1)+"</a>");
                };
            }else{
                var ma=pageIndex+1>this.totalPageSize?this.totalPageSize:pageIndex+1;
                for(var i=pageIndex-2;i<ma;i++){
                    this.pageListBox.append("<a href='javascript:void(0);'>"+(i+1)+"</a>");
                };    
            };
        },
        //第一次初始化分页列表
        initPageList:function(pageSize){
            //当页数小于等于5的时候
            if(pageSize<=5){
                //添加分页列表
                this.addPageList(pageSize,false);
            }else{
                //添加分页列表
                this.addPageList(3,true);
            };  
        },
        //切换选中样式
        changeStyle:function(currentIndex){
            //切换当前页码样式
            this.pageListBox.find("a:contains("+currentIndex+")").addClass("selected").siblings().removeClass("selected");
            //切换上下按钮样式
            if(currentIndex==1){
                this.prevBtn.addClass("no-disable");
            }else{
                this.prevBtn.removeClass("no-disable");
            };
            if(currentIndex==this.totalPageSize){
                this.nextBtn.addClass("no-disable");
            }else{
                this.nextBtn.removeClass("no-disable");
            };
        },
        //指定添加几个分页
        addPageList:function(length,isAddPoint,isEmpty){
            if(isEmpty){//知道添加前是否清楚原来的
                this.pageListBox.empty()
            };
            for(var i=0;i<length;i++){
                if(i==0){
                    this.pageListBox.append("<a href='javascript:void(0);' class='selected'>"+(i+1)+"</a>");
                }else{
                    this.pageListBox.append("<a href='javascript:void(0);'>"+(i+1)+"</a>");
                };
            };
            if(isAddPoint){
                this.pageListBox.append("<b>...</b>");
            };
        }
    };
    window["SelectPage"]=SelectPage;
})();