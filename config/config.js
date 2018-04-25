 /*
  * 설정
  */

 module.exports = {

     server_port: 3000,

     db_url: 'mongodb://localhost:27017/local',

     db_schemas: [{
             file: './mind_schema',
             collection: 'mind_schema',
             specified_collection_name: 'mind_schema',
             schemaName: 'mind_schema',
             modelName: 'mind_model'
         }
     ],

     route_info: [{
             method_file_path: '../routes/route_files/index_get',
             path: '/',
             type: 'get'
         }
     ],

     jsonrpc_api_path: '/api'
 }
