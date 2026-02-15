boss.setupDel = function(icon){
	icon.on('click',function(){
		boss.dbBoss.deleteAll()
	})
}