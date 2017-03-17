/**
 * Created by Chenhw on 2016/7/14.
 */
$GH.module("#J_aqb", function ($controller, $scope) {
	var Main = {
		init: function(){
			var isPolicy = false,
				$tab = $controller.find(".J_Tab"),
				$tabBtn = $tab.find(".tab-header span"),
				$chooseAgeBtn = $controller.find(".J_ChooseAgeBtn"),
				$chooseAge = $controller.find(".J_ChooseAge"),
				$chooseClose = $chooseAge.find(".J_Close"),
				$chooseBtn = $chooseAge.find(".J_ChooseBtn li a"),
				$policy = $controller.find("#J_Policy");

			// tab
			$tabBtn.on("click", function(){
				var i = $tabBtn.index(this);
				$(this).addClass('active').siblings().removeClass('active');
				$tab.find("ul li").eq(i).removeClass('hide').siblings('ul li').addClass('hide');
			});
			// 选择年龄
			$chooseAgeBtn.on("click", function(){
				$chooseAge.addClass("active");
			});
			$chooseClose.on("click", function(){
				$chooseAge.removeClass("active");
			});
			$chooseBtn.on("click", function(){
				var $this = $(this);
				$chooseBtn.removeClass("active");
				$this.addClass('active');
				isPolicy = true;
				$("#J_Cost").html("¥ "+$this.data("value").toFixed(2));
				$chooseAge.removeClass("active");
			});
			// 投保
			$policy.on("click", function(){
				var $this = $(this);
				if(isPolicy){
					location.href = $this.data("url");
				}else{
					$chooseAge.addClass("active");
				}
			});
			// 不满足要求的弹窗
			$("#J_yes").on("click", function(){
				$GH.confirm('抱歉，您暂时不满足我们的投保要求，试试为其他亲人投保吧！', [{
                    name: '确定',
                    style: 'btn-eteam',
                    fn: function(){
                        location.href = $GC.guahaoServer+"/cancer/index";
                    }
                }]);
			});
		}
	};

	Main.init();
});

$GH.module("#J_aqbInfo", function ($controller, $scope) {
	var Main = {
		init: function(){
			this.initSubmit();
			// 选择投保人
			$controller.find(".J_PatientsDropDown").dropdownSheet(null, function(select){
				var $select = select.find("option:selected");
				if($select.val() == 0){
					$controller.find(".J_InsureName").addClass("hide");
					$controller.find(".J_InsureCertNo").addClass("hide");
				}else{
					$controller.find(".J_InsureName").removeClass("hide");
					$controller.find(".J_InsureCertNo").removeClass("hide");
				}
			});
		},
		initSubmit: function(){
			var $form = $controller.find("#fillForm"),
				showInfo = $controller.find(".J_ShowInfo"),
				$showForm = $controller.find(".J_ShowInfoForm");

			// 上一步
			$controller.find("#J_Prev").on("click", function(){
				$form.removeClass("hide");
				showInfo.addClass("hide");
				$showForm.addClass("hide");
			});
			// 表单验证
			$controller.find("#J_Next").on("click", function(){
				var $val = $controller.find("#J_PatientSel option:selected").val(),
					valid = $GH.validate({
						"#holderName": {
							"required": "姓名不能为空"
						},
						"#holderCertNo": {
							"required": "身份信息不能为空",
							"idcard": "仅支持二代身份证，请重新输入正确的身份证号码！"
						},
						"#holderMobile": {
							"required": "手机号不能为空",
							"mobile": "手机号格式不正确"
						},
						"#emailNum": {
							"required": "邮箱不能为空",
							"email": "邮箱格式不正确"
						}
					});

				if(!$controller.find(".J_IsDefault").is(":checked")){
					$GH.alert("请认真阅读并同意保险条款");
					return false;
				};
				if($val != 0){
					if($("#insureName").val() == ''){
						$GH.alert("被保人姓名不能为空");
						return false;
					}
					if(!$GH.verifyIdcard($("#insureCertNo").val())){
						$GH.alert("被保人身份证不合法");
						return false;
					}
				};

				if(valid){
					var dataJson = {
						holderName: $form.find("#holderName").val(),
						holderCertNo: $form.find("#holderCertNo").val(),
						holderMobile: $form.find("#holderMobile").val(),
						emailNum: $form.find("#emailNum").val(),
						insureRelationShip: $form.find("#J_PatientSel option:selected").val(),
						insureName: $form.find("#insureName").val(),
						insureCertNo: $form.find("#insureCertNo").val()
					};

					$.ajax({
						url: $GC.guahaoServer+"/cancer/affirmfillinfor",
						type: "post",
						data: dataJson,
						dataType: "json",
						success: function(res){
							if(res.hasError){
								$GH.alert(res.message);
							}else{
								var inNo, inPrice,
									reulst = res.data;
								$controller.find("#age").html(reulst.age+"周岁");
								$controller.find("#price").html("￥ "+reulst.insurePrice.toFixed(2)+"元");
								$controller.find(".J_ShowName").html(reulst.holderName);
								$controller.find(".J_ShowCard").html(reulst.holderCertNo);
								$controller.find(".J_ShowPhone").html(reulst.holderMobile);
								$controller.find(".J_ShowEmail").html(reulst.emailNum);
								$controller.find(".J_ShowShip").html($controller.find("#J_RelationShip").val());
								if(reulst.insureRelationShip == 0){
									$controller.find(".J_ShowInName").addClass("hide");
									$controller.find(".J_ShowInCard").addClass("hide");
								}else{
									$controller.find(".J_ShowInName span").html(reulst.insureName);
									$controller.find(".J_ShowInCard span").html(reulst.insureCertNo);
									$controller.find(".J_ShowInName").removeClass("hide");
									$controller.find(".J_ShowInCard").removeClass("hide");
								}

								inNo = reulst.insureRelationShip == 0 ? reulst.holderName : reulst.insureName;
								inPrice = reulst.insureRelationShip == 0 ? reulst.holderCertNo : reulst.insureCertNo;
								$showForm.find("[name=holderName]").val(reulst.holderName);
								$showForm.find("[name=holderCertNo]").val(reulst.holderCertNo);
								$showForm.find("[name=holderMobile]").val(reulst.holderMobile);
								$showForm.find("[name=emailNum]").val(reulst.emailNum);
								$showForm.find("[name=insureRelationShip]").val(reulst.insureRelationShip);
								$showForm.find("[name=insureName]").val(inNo);
								$showForm.find("[name=insureCertNo]").val(inPrice);
								$showForm.find("[name=insurePrice]").val(reulst.insurePrice);

								$form.addClass("hide");
								showInfo.removeClass("hide");
								$showForm.removeClass("hide");
							}
						},
						error: function(xhr){
							$GH.alert('操作失败，请稍后再试！');
						}
					});
				};
			});
		}
	};

	Main.init();
});
