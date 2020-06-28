class File {
    constructor(name) {
        this.name = name
    }
}
    
class Dir extends File {
    constructor(name, files) {
        super(name)
        this.files = files ? files : []
    }
}
    
let f1 = new File('f1')                         // 1
let f2 = new File('f2')                         // 1
let f3 = new File('f3')                         // 0
let dir2 = new Dir('dir2', [f3])                // 1
let dir1 = new Dir('dir1', [f1, f2, dir2])      // 2
let dir3 = new Dir('dir3')                      // 2
let root = new Dir('root', [dir1, dir3])        // 3
    
function dfs(node) {
    if (!node.files) {
        return [{ "name": node.name, "layer": 0 }];
    }
    let paths = []
    let childrenLayers = []
    for (let n of node.files) {
        let tempPath = dfs(n);
        paths.push(tempPath);
        childrenLayers.push(tempPath[0]);
    }
    let max = Math.max(...childrenLayers.map(e => e.layer));
    for (let path of paths) {
        path[0].layer = max;
    }
    paths = paths.flat();
    return [{ "name": node.name, "layer": max + 1 }].concat(paths);
}
    
let path = dfs(root)
for (let e of path) {
    let c = ""
    for (let i = 1; i <= path[0].layer - e.layer; i++) {
        c += '    ';
    }
    console.log(c+e.name);
}