const fs = require('fs');
const path = require('path');

const args = process.argv.splice(2);
const command = args.shift();

const file = path.join(process.cwd(), '/.tasks');

switch(command) {
    case 'list': {
        listTasks(file);
        break;
    }
    case 'add': {
        const taskDescr = args.join(' ');
        addTask(file ,taskDescr);
        break;
    }
    default: {
        console.log(`Usage: ${process.argv[0]} list|add [task description]`);
    }
}

function listTasks(file) {
    loadOrInitializeTasksArray(file, tasks => {
        for (let i in tasks) {
            console.log(`${+i+1}: ${tasks[i]}`);
        }
    })
}

function addTask(file, taskDescr) {
    loadOrInitializeTasksArray(file, tasks => {
        tasks.push(taskDescr);
        storeTasks(file, tasks);
    })
}

function loadOrInitializeTasksArray(file, callback) {
    fs.exists(file, exists => {
        if (exists) {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) throw err;
                data = data.toString();
                const tasks = JSON.parse(data || '[]');
                callback(tasks);
            })
        } else {
            callback([]);
        }
    })
}

function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', err => {
        if (err) throw err;
        console.log('Saved.');
    })
}