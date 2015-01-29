frappe.provide("templates/includes");
{% include "templates/includes/utils.js" %}
{% include "templates/includes/form_generator.js" %}

var Provider = inherit(RenderFormFields, {
	init: function(wrapper,cmd, entityid,operation){
		console.log(operation)
		this.wrapper = wrapper;
		this.args=cmd
		this.entityid=entityid
		this.operation=operation
		$(this.wrapper).empty()
		$('.field-area').empty()
		RenderFormFields.prototype.init(this.wrapper,this.args,this.entityid,this.operation)
		this.render_field()
	},
	render_field: function(){
		var me = this;
		$('.save_controller').bind('click',function(event) {
			console.log("clicked")
			me.res = {};
			var $id=$('.tab-pane.active').attr('id')
			$("form input,form textarea,form select").each(function(i, obj) {
				me.res[obj.name] = $(obj).val();
			})
			me.res["received_from"]="Desktop"
			me.res["provider"]=true
			console.log(me.operation)
			if (me.operation=='create_provider'){
				me.create_provider(me.res,$id,me)
			}
			else if (me.operation=='open_linkphr') {
				me.update_phr(me.res,$id,me)
			};		
		})
	},
	create_provider:function(res,cmd,me){
		frappe.call({
				method:'phr.templates.pages.provider.create_provider',
				args:{'data': res,"id":cmd,"profile_id":me.entityid},
				callback: function(r) {
					console.log(r)
					if(r.message) {
						if(r.message.returncode==129){
							console.log(r.message)
							me.add_profile_to_link(r.message.actualdata,r.message.entityid)
						}
					}
				}
			})
		/*var call_mapper={"basic_info":"update_profile","password":"update_password","update_phr":"manage_phr"}
		me[call_mapper[cmd]].call(me,res)*/
	},
	update_phr:function(res,cmd,me){
		frappe.call({
				method:'phr.templates.pages.profile.update_profile',
				args:{'data': res,"id":cmd},
				callback: function(r) {
					console.log(r)
					if(r.message) {
						$("input").val("");
						var dialog = frappe.msgprint(r.message);
					}
				}
			})
		/*var call_mapper={"basic_info":"update_profile","password":"update_password","update_phr":"manage_phr"}
		me[call_mapper[cmd]].call(me,res)*/
	},
	add_profile_to_link:function(data,entityid){
		$('#hp').find('p.nohp').remove()
		$wrap=$('#hp')
		dat=JSON.parse(data)
		/*console.log(["data",data["entityid"]])*/
		pro_data={"entityid":dat["entityid"],"fn":dat["name"]}
		console.log(pro_data)
		$(repl_str('<div class="list-group-item-side %(entityid)s">\
			<a noherf data-name=%(entityid)s>%(fn)s</a>\
			</div>', pro_data)).appendTo($wrap)
	}	



})
