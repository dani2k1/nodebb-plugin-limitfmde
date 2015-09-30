<!-- BEGIN posts -->
	<div class="<!-- IF categories.class -->{categories.class}<!-- ELSE -->col-md-3 col-sm-6 col-xs-12<!-- ENDIF categories.class -->">
		<div class="new-card" style="{function.generateCategoryBackground};overflow:hidden;">
			<a href="/topic/{posts.topic.slug}/{posts.index}">{posts.title}</a>
				<div class="new-card-body">
					<div>
						{posts.content}
						<p class="fade-out"></p>
					</div>
				</div>
			</a>
			<div class="new-card-footer">	
				<div component="category/posts">
					<span class="pull-right post-preview-footer">
						<span class="timeago" title="{posts.relativeTime}"></span> &bull;
						<a href="/topic/{posts.topic.slug}/{posts.index}">[[global:read_more]]</a>
					</span>
				</div>
			</div>
		</div>
	</div>
<!-- END posts -->