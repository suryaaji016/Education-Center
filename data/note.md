npx sequelize model:create --name User --attributes email:string,password:string,role:string

npx sequelize model:create --name Profile --attributes fullName:string,alamat:string,pendidikanTerakhir:string,userId:integer

npx sequelize model:create --name UserCategory userId:integer,categoryId:integer

npx sequelize model:create --name Category --attributes name:string

npx sequelize model:create --name Exercise --attributes question:string,answerKey:string,categoryId:integer

npx sequelize model:create --name Score --attributes userId:integer,categoryId:integer,score:integer