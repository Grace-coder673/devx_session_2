import { stdin, stdout } from "process";
import readline from 'readline/promises';
import { sql } from "./constants/db.js";

const rl = readline.createInterface({
input: stdin,
output: stdout
})
async function readVal(p){
    let res = await rl.question(p)
return res;
}
async function showMenu(){
const res = await readVal("1. Show available users \n2.Create a new user \n3. Delete user\n4. Exit \nChoose anoption: ");
return res;
}
async function createUser(){
const name = await readVal("Enter name: ");
const username = await readVal("Enter username: ");
const email = await readVal("Enter email: ");
const day = Number(await readVal("Enter day in dob: "))
const month = Number(await readVal("Enter month in dob(1 - 12): "));
const year = Number(await readVal("Enter year in dob: "));
const dob = new Date(year, month - 1, day + 1); //month is 0 indexedin JS Date object
return {name, username, email, dob: dob.toDateString()}
}
async function main(){
let loop = true;

do{
    const option = Number(await showMenu());
try{
switch(option){
case 1:{
//get all users and display
const users = await sql`SELECT * FROM users;`;
console.log("\nAvailable users:");
if(users.length === 0){
console.log("No users found.\n");
break;
}
users.forEach((user, index)=>{
console.log(`${index + 1} : ${JSON.stringify(user)}`);
});
console.log("\n");
break;
}
case 2:{
//create new user
console.log("Create new user");
const user = await createUser();
await sql`INSERT INTO users (name, dob, username, email)
VALUES(${user.name}, ${user.dob}, ${user.username}, ${user.email})`;
console.log("User added successfully!\n")
break;
}
case 3:{
//Delete user
console.log("Delete user");
const username = await readVal("Enter username of user todelete: ");
await sql`DELETE FROM users WHERE username = ${username};`;
console.log("User successfully deleted.\n");
break;
}
case 4:{
//Exit
loop = false;
console.log("Exiting...\n");
break;
}
default:{
//invalid option
console.log("Invalid option\n");
}
}}
catch(err){
console.error("An error occured: ", err);
console.log("\n");
}
}while(loop)
process.exit(0)
}
await main()

async function edit(){
    const username = await readVal("Enter username of user to edit: ");
    const users = await sql`SELECT * FROM users WHERE username = ${username};`;
    if(users.length === 0){
        console.log("User not found");
        return;
    }

    const user = users[0];
    console.log("Current user:", JSON.stringify(user));

    const name = (await readVal(`Enter name (${user.name}): `)) || user.name;
    const newUsername = (await readVal(`Enter username (${user.username}): `)) || user.username;
    const email = (await readVal(`Enter email (${user.email}): `)) || user.email;

    const changeDob = (await readVal("Change date of birth? (y/N): ")).trim().toLowerCase();
    let dob = user.dob;
    if(changeDob === 'y' || changeDob === 'yes'){
        const day = Number(await readVal("Enter day in dob: "));
        const month = Number(await readVal("Enter month in dob (1-12): "));
        const year = Number(await readVal("Enter year in dob: "));
        dob = new Date(year, month - 1, day + 1).toDateString();
    }

    await sql`UPDATE users
              SET name = ${name}, username = ${newUsername}, email = ${email}, dob = ${dob}
              WHERE username = ${username};`;

    console.log("User updated successfully");
}

async function searchUsers(){
    const term = (await readVal("Enter search term (name, username or email): ")).trim();
    if(!term){
        console.log("Empty search term");
        return;
    }
    const pattern = `%${term}%`;
    const users = await sql`
        SELECT * FROM users
        WHERE LOWER(username) LIKE LOWER(${pattern})
           OR LOWER(name) LIKE LOWER(${pattern})
           OR LOWER(email) LIKE LOWER(${pattern});
    `;
    if(users.length === 0){
        console.log("No users matched");
        return;
    }
    console.log("\nMatched users:");
    users.forEach((user, i) => {
        console.log(`${i + 1} : ${JSON.stringify(user)}`);
    });
    console.log("");
}
