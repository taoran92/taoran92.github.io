---
layout: default
title: 读书
permalink: /pages/read.html
---

<div class="home">
	<div class="bookpiclist">
		<p>纵使寂寞开成海 我会一直在 即便风景都尘埃 我会一直爱。<br>
		日常微信读书出没，Wechat：chucheng92</p>
		{% for page in site.posts %}
				{% if page.categories[0] == '读书' %}
					{% for book in page.books %}
					<div class="bookpic">
						<div class="bookpic-wrapper">	
							<a class="pjaxlink" href="{{page.url}}#{{ book.title }}"><img src="{{ book.cover }}" alt="cover">
								<div class="booklabel">
															<div class="label-text center">
																{% if book.status == '已读' %}
										<span class="label label-success">{{ book.status }}</span>
										{% elsif book.status == '在读' %}
										<span class="label label-info">{{ book.status }}</span>
										{% elsif book.status == '未读' %}
										<span class="label label-default">{{ book.status }}</span>
										{% endif %}
															  </div>
														<div class="label-bg"></div>
												 </div>						
							</a>
						</div>
					</div>
					{% endfor %}
				{% endif %}
		{% endfor %}
	</div>
	<div class="clear"></div>
</div>
<h2>多挣钱 物质自由 多读书 精神自由</h2>