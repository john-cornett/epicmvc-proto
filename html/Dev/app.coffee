warn= (str,o) -> console.warn "WARNING", str, o ? ''
err=  (str,o) -> console.error "ERROR", str, o ? ''; throw new Error "ERROR: "+ str

window.EpicMvc.app$Dev=
	OPTIONS:
		warn: warn
		err: err
		# option.c1 inAction # if inAction isnt false
		c1: (inAction) -> warn "IN CLICK" if inAction isnt false

		# option.a1 view_name, aModels #if view_name not of aModels
		a1: (view_name, aModels) ->
			return if view_name of aModels
			err "Could not find model (#{view_name}) in namespace E.Model", aModels
			return

		# option.a2 view_name, aModels, attribute #if attribute not of aModels[ view_name]
		a2: (view_name, aModels, attribute) ->
			return if attribute of aModels[ view_name]
			err "Could not find model (#{view_name}) in namespace E.Model", aModels
			return

		# option.m1 view, model #if not E.Model[ model.class]?
		m1: (view, model) ->
			return if model.class of E.Model
			err "Processing view (#{view}), model-class (#{model.class}) not in namespace E.Model", model
			return


		m2: (view_nm, act, parms) ->
			err "Model (#{view_nm}).action() didn't know action (#{act})"
			return
		m3: (view_nm, tbl_nm, table) ->
			return if tbl_nm of table
			err "Model (#{view_nm}).loadTable() didn't know table-name (#{tbl_nm})"
			return
		m4: (view_nm, fistNm, row) ->
			err "Model (#{view_nm}).fistValidate() didn't know FIST (#{fistNm})"
			return
		m5: (view_nm, fistNm, row) ->
			err "Model (#{view_nm}).fistGetValues() didn't know FIST (#{fistNm})"
			return
		m6: (view_nm, fistNm, fieldNm, row) ->
			err "Model (#{view_nm}).fistGetChoices() did't know FIST-FIELD (#{fistNm}-#{fieldNm})"
			return

		# WARNING: "No app. entry for action_token (#{action_token}) on path (#{original_path})"
		# option.ca1 action_token, original_path, action_node #if not action_node?
		ca1: (action_token, original_path, action_node) ->
			return if action_node?
			warn "No app. entry for action_token (#{action_token}) on path (#{original_path})"
			return

		# WARNING: "Action (#{action_token}) request data is missing param #{nm}"
		# option.ca2 action_token, original_path, nms, data, action_node
		ca2: (action_token, original_path, nms, data, action_node)->
			for nm in nms when nm not of data
				warn "Missing param (#{nm}) for action (#{action_token}), Path: #{original_path}", {data,action_node}
			return

		# option.ca3 action_token, original_path, action_node, aMacros #if not aMacros[action_node.do]
		ca3: (action_token, original_path, action_node, aMacros) ->
			return if action_node.do of aMacros
			err "Missing (#{action_node.do}) from MACROS; Action: (#{action_token}), Path: (#{original_path})"
			return

		# option.ca4 action_token, original_path, action_node, what if not action_node.fist of E.fistDef
		ca4: (action_token, original_path, action_node, what) ->
			return if action_node[ what] of E.fistDef
			err "Unknown Fist for '#{what}:' #{action_node[ what]}); Action: (#{action_token}), Path: (#{original_path})", {action_node}
			return

		# E.option.fi1 fist # Guard e.g. E[ E.appFist fistNm]()
		fi1: (fist)->
			fistNm= fist.nm
			model= E.appFist fistNm
			if not model?
				err "FIST is missing: app.js requires MODELS: <model-name>: fists:[...,'#{fistNm}']", {fist}
			return

		# E.option.fi2 field # Verify h2h, d2h, h2d, validate exist in namespace
		fi2: (field)->
			for attr in ['h2h','d2h','h2d','validate'] when attr of field
				type= if attr is 'validate' then 'VAL' else attr.toUpperCase()
				filtList= if attr is 'h2h' then field[ attr] else [ field[ attr]]
				for filtNm in filtList when filtNm and (filt= 'fist'+ type+ '$'+ filtNm) not of E
					err "Missing Fist Filter (E.#{filt}) in FIELD (#{field.fieldNm}) for FIST (#{field.fistNm})", {field}
			return

		# E.option.fi3 field, val # Warn if not val?
		fi3: (field, val)->
			return if val?
			warn "FIST field value is undefined in FIELD (#{field.fieldNm}) for FIST (#{field.fistNm})", {field}
			return
		# E.option.fi4 type, fist, field # No such 'type' for pulldown/radio list
		fi4: (type, fist, field) ->
			err "Unknown pulldown/radio option (#{type}) in FIELD #{field.fieldNm} for FIST #{field.fistNm}.", {field}
			return

		# E.option.v1 val, spec # Fell into default arm of View:variable-get-with-spec
		v1: (val, spec) ->
			err "Unknown variable specification/filter (##{spec})"
			val ? '' # Return this, so caller gets the unparsed result

		# E.option.w1 wistNm # Ensure wistNm in E.wistDef
		w1: (wistNm) ->
			return if wistNm of E.wistDef
			err "Unknown Wist (#{wistNm})."
			return

	SETTINGS:
		frames: MMM_Dev: 'bdevl'
	MODELS:
		Devl:     class: "Devl$Dev",       inst: "iDev_Devl"
		View:     class: "View$Dev",       inst: "iDev_View"
	ACTIONS:
		dbg_toggle:         do: 'Devl.toggle', pass: 'what'
		dbg_refresh:        do: 'Devl.clear_cache'
		dbg_open_model:     do: 'Devl.open_model', pass: 'name'
		dbg_open_table:     do: 'Devl.open_table', pass: 'name'
		dbg_open_subtable:  do: 'Devl.open_subtable', pass: 'name'
		dbg_close_subtable: do: 'Devl.close_subtable'
		dbg_table_left:     do: 'Devl.table_left'
		dbg_table_right:    do: 'Devl.table_right'
		dbg_table_col_set:  do: 'Devl.table_col_set', pass: 'col'
		dbg_table_by_row:   do: 'Devl.table_row_set'

