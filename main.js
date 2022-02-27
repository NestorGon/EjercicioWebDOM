fetch('https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json')
.then( response => response.json() )
.then( response => {
    let i = 1;
    let correlation = {};
    let list = [];
    response.forEach(item => {
        let table = document.querySelector('#table1');
        let color = item.squirrel? 'class="table-danger"':'';
        table.innerHTML += `
            <tr ${color}>
                <th scope="row">${i}</th>
                <td>${item.events.toString()}</td>
                <td>${item.squirrel}</td>
            </tr>
        `;
        i += 1;
        item.events.forEach(event => {
            if (correlation[event.toString()]===undefined)
                correlation[event.toString()] = {TP:0,TN:0,FP:0,FN:0};
        });
    });
    response.forEach(item => {
        Object.keys(correlation).forEach(event => {
            if (item.events.filter(x => x === event).length == 1) {
                if (item.squirrel)
                    correlation[event]['TP'] += 1;
                else
                    correlation[event]['FN'] += 1;
            }
            else {
                if (item.squirrel)
                    correlation[event]['FP'] += 1;
                else
                    correlation[event]['TN'] += 1;
            }
        });
    });
    Object.keys(correlation).forEach(event => {
        let tptn = correlation[event]['TP'] * correlation[event]['TN'];
        let fpfn = correlation[event]['FP'] * correlation[event]['FN'];
        let tpfp = correlation[event]['TP'] + correlation[event]['FP'];
        let tpfn = correlation[event]['TP'] + correlation[event]['FN'];
        let tnfp = correlation[event]['TN'] + correlation[event]['FP'];
        let tnfn = correlation[event]['TN'] + correlation[event]['FN'];
        let obj = {};
        obj['name'] = event;
        obj['correlation'] = (tptn-fpfn)/Math.sqrt(tpfp*tpfn*tnfp*tnfn);
        list.push(obj);
    });

    list.sort((a,b) => {
        return a['correlation'] > b['correlation'] ? -1: (a['correlation'] == b['correlation'] ? 0: 1);
    });
    return list;
})
.then( response => {
    let i = 1;
    response.forEach(item => {
        let table = document.querySelector('#table2');
        table.innerHTML += `
            <tr>
                <th scope="row">${i}</th>
                <td>${item.name}</td>
                <td>${item.correlation}</td>
            </tr>
        `;
        i += 1;
    });
});