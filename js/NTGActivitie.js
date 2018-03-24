function NTGActivitie(data) {    
  if (!data) return;
  this["id"] = data.Id | null,
  this["type"] = data.Type || null;
  this["line"] = data.Line || null ;
  this["functionArea"] = data.FunctionArea || null;
  this["station"] = data.Station || null;
  this["position"] = data.Position || null;
  this["project"] = data.Project || null;
  this["responsible"] = data.Responsible || null;
  this["input"] = data.Input || null;
  this["ncg"] = data.NCG || null;
  this["activity"] = data.Activity || null;
  this["inputDate"] = data.InputDate || null;
  this["adAproval"] = data.AdAproval || null;
  this["reqAlmox_OS"] = data.ReqAlmox_OS || null;
  this["statusReq_OS"] = data.StatusReq_OS || null;
  this["rcNumber"] = data.RcNumber || null;
  this["rcStatus"] = data.RcStatus || null;
  this["orderNumber"] = data.OrderNumber || null;
  this["infra_Layout"] = data.Infra_Layout || null;
  this["installation_TryOut"] = data.Installation_TryOut || null;
  this["handover"] = data.Handover || null;
  this["phase"] = data.Phase || null;
  this["projectPercent"] = data.ProjectPercent || 0;
  this["projectStatus"] = data.ProjectStatus || null;
  this["comments"] = data.Comments || null;
  this["priority"] = data.Priority || 0;
  this["npr"] = data.Npr || null;
  return this;
}