# Copyright 2007-2014 by James Shelby, shelby (at:) dtsol.com; All rights reserved.

class Devl extends window.EpicMvc.ModelJS
	constructor: (Epic,view_nm) ->
		super Epic, view_nm
		@opts= file: false, tag: false, tag2: false, form: false, model: false, stack: false
		@open_model= ''
		@open_table= ''
		@open_table_stack= []
		@table_row_cnt= 0
		@table_by_col= false
		@table_col= false
	eventNewRequest: ->
		@invalidateTables true
		setTimeout (=> @invalidateTables true), 2000
	action: (act,p) ->
		f= 'dM:Devl('+ act+ ')'
		r= {}
		i= new window.EpicMvc.Issue @Epic
		m= new window.EpicMvc.Issue @Epic
		switch act
			when 'toggle' # p.what(file,tag,form)
				@opts[p.what]= not @opts[p.what]
			when 'clear_cache'
				@Epic.loader.clearCache()
			when 'open_model' # p.name
				if @open_model isnt p.name
					@open_model= p.name
					@open_table= ''
					@open_table_stack= []
				else @open_model= ''
				delete @Table.Model
			when 'close_subtable' # Pop list, in case of nested tables
				return unless @open_table_stack.length
				[dummy, @table_row_cnt, @table_by_col, @table_col]= @open_table_stack.pop()
				delete @Table.Model
			when 'open_subtable' # p.name
				@open_table_stack.push [p.name, @table_row_cnt, @table_by_col, @table_col]
				@table_row_cnt= 0
				@table_by_col= false
				@table_col= false
				delete @Table.Model
			when 'open_table' # p.name
				if @open_table isnt p.name
					@table_row_cnt= 0
					@table_by_col= false
					@table_col= false
					@open_table= p.name
					@open_table_stack= []
				else
					@open_table= ''
				delete @Table.Model
			when 'table_row_set' #p.row(opt)
					@table_by_col= false
					@table_row_cnt= p.row if p.row?
			when 'table_col_set' #p.col
					@table_col= p.col
					@table_by_col= true
			when 'table_left', 'table_right'
				incr= if act is 'table_left' then -1 else 1
				_log2 f, act, incr, @table_row_cnt
				@table_row_cnt+= incr
				delete @Table.Model
			else return super act, p
		[r, i, m]
	loadTable: (tbl_nm) ->
		f= 'dM:Devl.loadTable('+ tbl_nm+ ')'
		switch tbl_nm
			when 'Opts' then @Table[tbl_nm]= [@opts]
			when 'Model'
				table= []
				for inst of @Epic.oModel
					nm= @Epic.oModel[inst].view_nm
					row= $.extend {is_open: '', Table: []}, {inst: inst, name: nm}
					row.is_open= 'yes' if nm is @open_model
					for tnm,rec of @Epic.oModel[ inst].Table # Walk to each of this model's tables
						# Check need to walk to a sub table and/or if this table is 'opened' (to populate Cols/Rows)
						tnm_s= tnm # Push names of tables/sub-tables
						rec_s= rec # Start at top of table
						open= false
						is_sub= false
						if row.is_open is 'yes' and tnm is @open_table # This model+table was selected/opened
							open= true
							if @open_table_stack.length
								for tref in @open_table_stack
									[sub_tnm, row_inx]= tref
									break if row_inx not of rec_s or sub_tnm not of rec_s[row_inx]
									is_sub= true
									rec_s= rec_s[row_inx][sub_tnm]
									tnm_s+= ','+ sub_tnm

						len= rec_s.length
						trow= is_open: open, is_sub: is_sub, name: tnm_s, rows: len, Cols: [], row_cnt: 0, col: '', curr_col: @table_col, by_col: @table_by_col
						if open
							@table_row_cnt= len- 1 if @table_row_cnt< 0
							@table_row_cnt= 0 if @table_row_cnt> len- 1
							trow.row_cnt= @table_row_cnt

						if len
							cols= (rcol for rcol of rec_s[0]) # List cols; select one via table-row-cnt
						else cols= []
						trow.cols= if len then cols.join ', ' else 'no rows'
						if len and open
							if not @table_by_col # List cols/vals
								trow.Cols=({
									type: (if rval is null then 'Null' else typeof rval)
									col_ix: (cols.indexOf rcol), col: rcol, len: rval?.length
									val: rval ? '???'
									} for rcol,rval of rec_s[ @table_row_cnt])
							else # List all rows with one col's vals
								trow.Rows=({
									row: rrow, len: rec_s[rrow][ @table_col]?.length
									type: (if rec_s[rrow][ @table_col] is null then 'Null' else typeof rec_s[rrow][ @table_col])
									val: rec_s[rrow][ @table_col] ? '???'
									} for rrow of rec_s)
						row.Table.push trow
					row.tables= row.Table.length
					table.push row
					table.sort (a,b) ->
						if a.inst is b.inst then 0
						else if a.inst> b.inst then 1
						else -1

				_log2 f, 'final', table
				@Table[tbl_nm]= table
			else super tbl_nm

window.EpicMvc.Model.Devl$BaseDevl= Devl
