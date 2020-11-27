const router = require('koa-router')();
const fs = require('fs');
const join = require('path').join;
var readline = require('readline');
const proc = '/proc'; //路径
let result = []; //文件绝对路径数组
let promises = [];
router.get("/tree", async ctx => {
    result = [];
    promises = [];
    var read_file = (path, callback) => { //文件流
        var fRead = fs.createReadStream(path);
        var objReadline = readline.createInterface({ //行读取
            input: fRead
        });
        var arr = new Array();
        objReadline.on('line', (line) => {
            arr.push({
                content: line,
                temp: datadeal(line) //信息以":"分割
            });
        });
        objReadline.on('close', () => {
            callback(arr);
        });
    }
    findinfo(proc); //调用findinfo函数得到promise对象
    await Promise.all(promises).then(d => { //同步调用promise.all方法得到promise对象并赋值data
        data = convert(d);
    })
    //console.log(data)
    //console.log("------------------------")
    return ctx.body = {
        state: 200,
        msg: '蒋新的进程树',
        data: data,
    }

    /*遍历status文件，获取数据，参数:*/
    function findinfo(startPath) {
        let dir = getdir(startPath) //得到所有文件的绝对路径
        dir.forEach((info, index) => { //从数组中遍历文件
            let fPath = join(info, "/status"); //文件路径拼接到status的绝对路径
            promises.push( //使用promise获取异步执行的每个结果
                new Promise((resolve) => {
                    read_file(fPath, (data) => { //使用行读文件读取每行
                        let json = {};
                        data.forEach(d => {
                            let temp = d.temp;
                            if (temp[0] == "Name" || temp[0] == "Pid" || temp[0] == "PPid") {
                                json[temp[0]] = temp[1]; //如果出现行信息满足所要的三个数据，即添加到数组中存储
                            }
                        });
                        resolve(json); //返回数据给promise对象
                    })
                })
            )
        });
    }

    /*数据分隔*/
    function datadeal(str1) {
        var regex = /:/;
        var strAry = str1.split(regex); //以":"为分割点
        for (i = 0; i < strAry.length; i++) {
            strAry[i] = strAry[i].replace(/\s*/g, ""); //分割后的数组去掉空格符
        }
        return strAry; //返回数组
    }

    /*数字目录，参数/proc路径，返回路径数组*/
    function getdir(startPath) {
        finder(startPath); //调用finder得到完整数组
        return result;
    }

    /*文件筛选，参数/proc路径，无返回值*/
    function finder(startPath) {
        let files = fs.readdirSync(startPath);
        files.forEach((val, index) => { //遍历文件
            let fPath = join(startPath, val); //获取绝对路径
            let stats = fs.statSync(fPath); //返回fs.Stats的实例
            if (stats.isDirectory()) { //判断是否为文件夹
                if (!isNaN(val)) { //判断文件名是否为数字
                    result.push(fPath) //添加进文件路径数组
                }
            };
        });
    }

    /*数据结构化，参数:obj,返回obj*/
    function convert(rows) {
        function exists(rows, PPid) { //寻找父节点
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].Pid == PPid) return true;
            }
            return false;
        }
        var nodes = [];
        for (var i = 0; i < rows.length; i++) { //父节点
            var row = rows[i];
            if (!exists(rows, row.PPid)) { //两次遍历数组，寻找父节点
                nodes.push({ //返回数据信息
                    Pid: row.Pid,
                    Name: row.Name,
                    title: row.Name + "(" + row.Pid + ")",
                });
            }
        }
        var toDo = [];
        for (var i = 0; i < nodes.length; i++) {
            toDo.push(nodes[i]); //父节点存储
        }
        while (toDo.length) {
            var node = toDo.shift(); //数组中第一个元素移除原数组并返回被移除元素 
            for (var i = 0; i < rows.length; i++) { //子节点
                var row = rows[i];
                if (row.PPid == node.Pid) {
                    var child = {
                        Pid: row.Pid,
                        Name: row.Name,
                        title: row.Name + "(" + row.Pid + ")",
                    };
                    if (node.children) {
                        node.children.push(child);
                    } else {
                        node.children = [child];
                    }
                    toDo.push(child);
                }
            }
        }
        return nodes;
    }

});

module.exports = router;