var request = require("request");
var NodeCache = require("node-cache");
var myCache = new NodeCache();

var Base = function(){};
Base.prototype.baseHost = process.env.HOST_CMS_BACKEND;

Base.prototype.salvar = function(callback){
    var data = this;
    var restName = this.restName;
    var baseHost = this.baseHost;
    request.head(baseHost + "/" + restName + ".json", function(){
        token = this.response.headers.auth_token;
        if(data.id === "" || data.id === undefined || data.id === 0 ){
            request.post({ 
                url: baseHost + "/" + restName + ".json", 
                headers: {'auth_token': token }, 
                form: data
            }, function(error, response, body){
                    if( response.statusCode == 201 ) {
                        callback( {
                            erro: false
                        });
                    }
                    else{        
                        var json = JSON.parse(response.body);
                        callback({
                            erro: true,
                            mensagem: json.erro
                        });
                    }
                }); 
                
        }
        else {
            request.put({ 
                url: baseHost + "/" + restName + ".json", 
                headers: {'auth_token': token }, 
                form: data
            }, function(error, response, body){
                    if( response.statusCode >= 200 && response.statusCode <= 299 ) {
                        callback( {
                            erro: false
                        });
                    }
                    else{        
                        var json = JSON.parse(response.body);
                        callback({
                            erro: true,
                            mensagem: json.erro
                        });
                    }
            });              
        }

    });    
};

Base.prototype.autenticar = function(callback){
    var data = this;
    var restName = this.restName;
    var baseHost = this.baseHost;
    request.head(baseHost + "/" + restName + ".json", function(){
        token = this.response.headers.auth_token;
            request.post({ 
                url: baseHost + "/" + restName + ".json", 
                headers: {'auth_token': token }, 
                form: data
            }, function(error, response, body){
                    if( response.statusCode == 200 ) {
                        callback( {
                            erro: false,
                            data: response.body
                        });
                    }
                    else{        
                        var json = JSON.parse(response.body);
                        callback({
                            erro: true,
                            mensagem: json.erro
                        });
                    }
                }
            );   
    });    
};

Base.prototype.buscar = function(callback){
    var id = this.id;
    var restName = this.restName;
    var baseHost = this.baseHost;
    var key = 'cache-' + this.restName + '-' + id;

    
        request.head(baseHost + "/" + restName + ".json", function(){
            token = this.response.headers.auth_token;
            request.get({ 
                url: baseHost + "/" + restName + "/"+ id + ".json", 
                headers: {'auth_token': token }
            }, function(error, response, body){
                if( response.statusCode == 200 ) {
                    var value = JSON.parse(response.body); 
                    callback(value);  
                }
                else{        
                    var json = JSON.parse(response.body);
                    callback({
                        erro: true,
                        mensagem: json.erro
                    });
                }
            }); 
        });    
        
};

Base.prototype.excluir = function(callback){
    var id = this.id;
    var restName = this.restName;
    var baseHost = this.baseHost;
    request.head(baseHost + "/" + restName + ".json", function(){
        token = this.response.headers.auth_token;
        if(id === "" || id === undefined || id === 0 ){
            callback({
                erro: true,
                mensagem: "Id para exclusão obrigatorio"
            });
        }
        else{
            request.delete({ 
                url: baseHost + "/" + restName + "/"+ id + ".json", 
                headers: {'auth_token': token }
            }, function(error, response, body){
                    if( response.statusCode >= 200 && response.statusCode <= 299  ) {
                        callback( {
                            erro: false
                        });
                    }
                    else{        
                        var json = JSON.parse(response.body);
                        callback({
                            erro: true,
                            mensagem: json.erro
                        });
                    }
                }
            );        
        }
    });
};

Base.prototype.todos = function(callback){     
    request.get({ 
        url: this.baseHost + "/" + this.restName + ".json" }, function(error, response, body){
            var json = JSON.parse(response.body);
            if( response.statusCode == 200 ) {
                callback(json);
            }
            else{  
                callback({
                    erro: true,
                    mensagem: json.erro
                });
            }
        }
    );         
            
};


module.exports = Base;